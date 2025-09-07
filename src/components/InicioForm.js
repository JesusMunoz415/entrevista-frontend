// frontend/src/components/InicioForm.js
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function InicioForm() {
  const [nombrePostulante, setNombrePostulante] = useState('');
  const [error, setError] = useState('');

  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const entrevistadorId = params.get('entrevistadorId');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!nombrePostulante.trim()) {
      setError('El nombre del postulante es obligatorio.');
      return;
    }

    try {
      // 1️⃣ Crear postulante
      const resPostulante = await fetch('https://entrevista-backend.onrender.com/api/postulantes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombrePostulante,
          correo: '',
          telefono: ''
        }),
        credentials: 'include'
      });

      const dataPostulante = await resPostulante.json();

      if (dataPostulante.status !== 'ok') {
        setError(dataPostulante.mensaje || 'No se pudo registrar el postulante.');
        return;
      }

      const postulanteId = dataPostulante.id;

      // 2️⃣ Crear entrevista automáticamente
      const fecha = new Date().toISOString(); // Fecha actual
      const resEntrevista = await fetch('https://entrevista-backend.onrender.com/api/entrevistas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entrevistador_id: entrevistadorId,
          postulante_id: postulanteId,
          fecha
        }),
      });

      const dataEntrevista = await resEntrevista.json();

      if (dataEntrevista.status !== 'ok') {
        setError(dataEntrevista.mensaje || 'No se pudo crear la entrevista.');
        return;
      }

      const entrevistaId = dataEntrevista.entrevista_id;

      // 3️⃣ Redirigir a la página de preguntas con entrevistaId (📌 Ahora el ID se toma de la URL)
      navigate(`/entrevista/${entrevistaId}?entrevistadorId=${entrevistadorId}`);


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
