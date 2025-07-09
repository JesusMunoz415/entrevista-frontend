import React from 'react';

function Result({ entrevistaId, respuestas, onVolver }) {
  // Si no vienen como props, cargarlos desde localStorage
  const idEntrevista = entrevistaId || localStorage.getItem('entrevistaId');
  const respuestasEvaluacion = respuestas || JSON.parse(localStorage.getItem('respuestas'));

  const enviarEvaluacion = async () => {
    try {
      const response = await fetch('https://entrevista-backend.onrender.com/api/respuestas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entrevistaId: idEntrevista,
          respuestas: respuestasEvaluacion,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('✅ Evaluación guardada correctamente');
      } else {
        console.error('Error al guardar evaluación:', data);
        alert('❌ Error al guardar la evaluación en el servidor');
      }
    } catch (err) {
      console.error('Error al enviar al backend:', err);
      alert('❌ Error de conexión con el backend');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <h2>Resultado de la entrevista</h2>

      <p><strong>Total de respuestas:</strong> {respuestasEvaluacion?.length}</p>

      <button onClick={enviarEvaluacion} style={{ margin: '10px', padding: '10px 20px' }}>
        Guardar evaluación
      </button>
      <button onClick={onVolver} style={{ margin: '10px', padding: '10px 20px' }}>
        Volver
      </button>
    </div>
  );
}

export default Result;
