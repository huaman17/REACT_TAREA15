import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // Cargar tareas desde localStorage al iniciar
  const tareasGuardadas = JSON.parse(localStorage.getItem('tareas')) || [];
  const [tareas, setTareas] = useState(tareasGuardadas);

  const [nuevaTarea, setNuevaTarea] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [filtro, setFiltro] = useState('todos'); // Estado para el filtro: 'todos', 'activas', 'completadas'

  // Guardar tareas en localStorage cada vez que cambien
  useEffect(() => {
    localStorage.setItem('tareas', JSON.stringify(tareas));
  }, [tareas]);

  const agregarTarea = () => {
    if (nuevaTarea.trim() === '') return;
    setTareas([...tareas, { texto: nuevaTarea, completada: false }]);
    setNuevaTarea('');
  };

  const eliminarTarea = (index) => {
    const nuevas = tareas.filter((_, i) => i !== index);
    setTareas(nuevas);
  };

  const toggleCompletada = (index) => {
    if (editingIndex === index) return;
    const nuevas = [...tareas];
    nuevas[index].completada = !nuevas[index].completada;
    setTareas(nuevas);
  };

  const handleEditStart = (index) => {
    setEditingIndex(index);
    setEditingText(tareas[index].texto);
  };

  const handleEditSave = (index) => {
    const nuevas = [...tareas];
    nuevas[index].texto = editingText.trim() === '' ? nuevas[index].texto : editingText;
    setTareas(nuevas);
    setEditingIndex(null);
    setEditingText('');
  };

  // --- NUEVA LÓGICA DE FILTRADO ---
  const tareasFiltradas = tareas.filter(tarea => {
    if (filtro === 'activas') return !tarea.completada;
    if (filtro === 'completadas') return tarea.completada;
    return true; // para 'todos'
  });

  // --- NUEVA FUNCIÓN PARA LIMPIAR COMPLETADAS ---
  const limpiarCompletadas = () => {
    setTareas(tareas.filter(tarea => !tarea.completada));
  };


  return (
    <div className="App">
      <h1>🧠 Lista de Tareas Pro</h1>
      <div className="input-area">
        <input
          type="text"
          placeholder="Escribe una tarea..."
          value={nuevaTarea}
          onChange={(e) => setNuevaTarea(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && agregarTarea()}
        />
        <button onClick={agregarTarea}>Agregar</button>
      </div>

      {/* --- NUEVOS BOTONES DE FILTRO --- */}
      <div className="filtros-container">
        <button className={filtro === 'todos' ? 'active' : ''} onClick={() => setFiltro('todos')}>Todas</button>
        <button className={filtro === 'activas' ? 'active' : ''} onClick={() => setFiltro('activas')}>Activas</button>
        <button className={filtro === 'completadas' ? 'active' : ''} onClick={() => setFiltro('completadas')}>Completadas</button>
      </div>

      <ul>
        {tareasFiltradas.map((tarea, index) => {
          // Necesitamos encontrar el índice original para poder modificarlo
          const originalIndex = tareas.findIndex(t => t === tarea);
          return (
            <li
              key={originalIndex}
              className={tarea.completada ? 'completada' : ''}
              onClick={() => toggleCompletada(originalIndex)}
            >
              {editingIndex === originalIndex ? (
                <input
                  type="text" className="edit-input" value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  onKeyPress={(e) => e.key === 'Enter' && handleEditSave(originalIndex)}
                  onBlur={() => handleEditSave(originalIndex)} // Guarda al perder el foco
                />
              ) : (
                <span>{tarea.texto}</span>
              )}
              <div className="buttons-container">
                {editingIndex === originalIndex ? (
                  <button className="action-btn save-btn" onClick={(e) => { e.stopPropagation(); handleEditSave(originalIndex); }}>✔️</button>
                ) : (
                  <button className="action-btn edit-btn" onClick={(e) => { e.stopPropagation(); handleEditStart(originalIndex); }}>✏️</button>
                )}
                <button
                  className="action-btn delete-btn"
                  onClick={(e) => { e.stopPropagation(); eliminarTarea(originalIndex); }}
                >
                  ❌
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {/* --- NUEVO BOTÓN PARA LIMPIAR --- */}
      {tareas.some(t => t.completada) && (
          <button className="limpiar-btn" onClick={limpiarCompletadas}>
            🧹 Limpiar completadas
          </button>
      )}
    </div>
  );
}

export default App;