//frontend/src/components/InicioForm.js

import React, { useState } from 'react';
import QuestionForm from './QuestionForm';

function InicioForm() {
  const [nombrePostulante, setNombrePostulante] = useState('');
  const [error, setError] = useState('');
  const [entrevistaIniciada, setEntrevistaIniciada] = useState(false);
  const [postulanteId, setPostulanteId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!nombrePostulante.trim()) {
      setError('El nombre del postulante es obligatorio.');
      return;
    }

    try {
      const response = await fetch(`https://entrevista-backend.onrender.com/api/postulantes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombrePostulante,
          correo: '',
          telefono: ''
        }),
        credentials: 'include'
      });

      const data = await response.json();

      if (data.status === 'ok') {
        setPostulanteId(data.id);
        setEntrevistaIniciada(true);
      } else {
        setError(data.mensaje || 'No se pudo registrar el postulante.');
      }
    } catch (err) {
      console.error(err);
      setError('Error al conectar con el servidor.');
    }
  };

  if (entrevistaIniciada && postulanteId) {
    return <QuestionForm entrevistaId={postulanteId} onSubmit={() => {}} />;
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#fff'
    }}>
      <form onSubmit={handleSubmit} style={{
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#206341' }}>Inicio de entrevista</h2>

        <label style={{ display: 'block', marginBottom: '8px', fontSize: '16px' }}>Nombre del postulante:</label>
        <input
          type="text"
          value={nombrePostulante}
          onChange={(e) => setNombrePostulante(e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            marginBottom: '10px'
          }}
        />

        {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}

        <button type="submit" style={{
          padding: '10px 20px',
          backgroundColor: '#3498db',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px'
        }}>
          Comenzar entrevista
        </button>
      </form>
    </div>
  );
}

export default InicioForm;
