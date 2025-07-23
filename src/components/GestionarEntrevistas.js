// frontend/src/components/GestionarEntrevistas.js

import React, { useState, useEffect } from 'react';

const GestionarEntrevistas = ({ entrevistadorId }) => {
  const [entrevistas, setEntrevistas] = useState([]);
  const [postulanteId, setPostulanteId] = useState('');
  const [fecha, setFecha] = useState('');
  const [enlace, setEnlace] = useState('');
  const [mensaje, setMensaje] = useState('');

  // 🗂️ Cargar entrevistas existentes al abrir
  useEffect(() => {
    const fetchEntrevistas = async () => {
      try {
        const response = await fetch('https://entrevista-backend.onrender.com/api/entrevistas');
        const data = await response.json();
        if (data.status === 'ok') {
          setEntrevistas(data.entrevistas);
        }
      } catch (err) {
        console.error('❌ Error al obtener entrevistas:', err);
      }
    };
    fetchEntrevistas();
  }, []);

  // ➕ Crear nueva entrevista
  const handleCrearEntrevista = async (e) => {
    e.preventDefault();
    setMensaje('');
    setEnlace('');

    if (!postulanteId || !fecha) {
      setMensaje('⚠️ Selecciona un postulante y una fecha.');
      return;
    }

    try {
      const response = await fetch('https://entrevista-backend.onrender.com/api/Inicio.form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entrevistador_id: entrevistadorId,
          postulante_id: postulanteId,
          fecha
        })
      });
      const data = await response.json();

     if (data.status === 'ok') {
          setEnlace(data.enlace); // 📎 Mostrar enlace único
          setMensaje('✅ Entrevista creada exitosamente.');
          setPostulanteId('');
          setFecha('');
          // Recargar lista
          setEntrevistas(prev => [...prev, { ...data.entrevista, estado: 'pendiente' }]);

          // 🌟 Redirigir directamente al enlace generado
          window.location.href = `${data.enlace}`;
        } else {
          setMensaje(data.mensaje || '❌ Error al crear entrevista.');
        }
    } catch (err) {
      console.error('❌ Error en la creación:', err);
      setMensaje('❌ Error al conectar con el servidor.');
    }
  };

  return (
    <div>
      <h2>📁 Gestión de Entrevistas</h2>
      <p>Aquí podrás crear, editar y eliminar entrevistas.</p>

      <form onSubmit={handleCrearEntrevista} style={{ marginTop: '20px' }}>
        <label>Postulante ID:</label>
        <input
          type="number"
          value={postulanteId}
          onChange={(e) => setPostulanteId(e.target.value)}
          placeholder="Ej: 1"
          required
          style={{ margin: '5px', width: '200px' }}
        />

        <label>Fecha:</label>
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          required
          style={{ margin: '5px', width: '200px' }}
        />

        <button type="submit" style={{ marginLeft: '10px' }}>Crear Entrevista</button>
      </form>

      {mensaje && <p style={{ marginTop: '10px', color: mensaje.startsWith('✅') ? 'green' : 'red' }}>{mensaje}</p>}

      {enlace && (
        <div style={{ marginTop: '15px', background: '#f1f3f5', padding: '10px', borderRadius: '6px' }}>
          <p>🔗 Enlace para el postulante:</p>
          <code>{enlace}</code>
        </div>
      )}

      <h3 style={{ marginTop: '30px' }}>📋 Entrevistas existentes</h3>
      <ul>
        {entrevistas.map((e) => (
          <li key={e.id}>
            ID: {e.id} | Postulante: {e.postulante_id} | Fecha: {e.fecha} | Estado: {e.estado}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GestionarEntrevistas;
