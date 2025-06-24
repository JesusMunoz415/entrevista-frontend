// frontend/src/components/QuestionForm.js
import React from 'react';

function QuestionForm({
  id_entrevista,
  id_pregunta,
  pregunta,
  respuesta,
  setRespuesta,
  calificacion,
  setCalificacion
}) {
  const handleGuardarRespuesta = async () => {
    try {
      const response = await fetch('https://entrevista-backend.onrender.com/api/guardar-respuesta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_entrevista,
          id_pregunta,
          respuesta,
          calificacion
        }),
        credentials: 'include'
      });

      const data = await response.json();
      if (data.status === 'ok') {
        console.log('✅ Respuesta guardada');
      } else {
        console.error('Error al guardar respuesta:', data.mensaje);
      }
    } catch (err) {
      console.error('Error de red:', err);
    }
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <p><strong>{pregunta}</strong></p>
      <textarea
        value={respuesta}
        onChange={(e) => setRespuesta(e.target.value)}
        rows="3"
        style={{ width: '100%' }}
      ></textarea>

      <div style={{ marginTop: '10px' }}>
        <label>Puntuación (0-2): </label>
        <select
          value={calificacion}
          onChange={(e) => setCalificacion(parseInt(e.target.value))}
        >
          <option value={0}>0</option>
          <option value={1}>1</option>
          <option value={2}>2</option>
        </select>

        <button
          type="button"
          onClick={handleGuardarRespuesta}
          style={{ marginLeft: '10px' }}
        >
          Guardar
        </button>
      </div>
    </div>
  );
}

export default QuestionForm;
