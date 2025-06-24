// frontend/src/components/InicioForm.js
import React, { useState } from 'react';

function InicioForm({ onContinue, entrevistadorId }) {
  const [nombrePostulante, setNombrePostulante] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!nombrePostulante.trim()) {
      setError('El nombre del postulante es obligatorio.');
      return;
    }

    try {
          const response = await fetch('https://entrevista-backend.onrender.com/api/postulantes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombrePostulante,
          correo: '',          // enviar aunque sea vacío
          telefono: ''
        }),
        credentials: 'include'
      });


      const data = await response.json();

      if (data.status === 'ok') {
        onContinue(data.id);
      } else {
        setError(data.mensaje || 'No se pudo registrar el postulante.');
      }
    } catch (err) {
      console.error(err);
      setError('Error al conectar con el servidor.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h2>Inicio de entrevista</h2>
      <p><strong>Entrevistador ID:</strong> {entrevistadorId}</p>

      <label>Nombre del postulante:</label>
      <input
        type="text"
        value={nombrePostulante}
        onChange={(e) => setNombrePostulante(e.target.value)}
        style={{ width: '100%' }}
      />

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button type="submit" style={{ marginTop: '10px' }}>
        Comenzar entrevista
      </button>
    </form>
  );
}

export default InicioForm;
