import React, { useEffect, useState } from 'react';

function Historial({ entrevistadorId, onVolver }) {
  const [entrevistas, setEntrevistas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const obtenerHistorial = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/historial', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ entrevistador_id: entrevistadorId })
        });

        const data = await response.json();
        if (data.status === 'ok') {
          setEntrevistas(data.entrevistas);
        } else {
          setError('No se pudo obtener el historial.');
        }
      } catch (err) {
        console.error(err);
        setError('Error de conexión con el servidor.');
      } finally {
        setCargando(false);
      }
    };

    obtenerHistorial();
  }, [entrevistadorId]);

  return (
    <div>
      <h2 style={{ color: 'seagreen' }}>Historial de entrevistas</h2>

      {cargando ? (
        <p>Cargando entrevistas...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : entrevistas.length === 0 ? (
        <p>No hay entrevistas registradas aún.</p>
      ) : (
        entrevistas.map((entrevista, i) => (
          <div key={i} style={{ padding: '15px', marginBottom: '25px', backgroundColor: '#fdfdfd', border: '1px solid #ccc', borderRadius: '8px' }}>
            <p><strong>Postulante:</strong> {entrevista.postulante}</p>
            <p><strong>Fecha:</strong> {entrevista.fecha}</p>

            {entrevista.respuestas.map((r, j) => (
              <div key={j} style={{ marginTop: '12px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '6px' }}>
                <p><strong>Pregunta:</strong> {r.pregunta}</p>
                <p><strong>Respuesta:</strong> {r.respuesta}</p>
                <p><strong>Evaluación automática:</strong> <pre>{r.evaluacion_automatica}</pre></p>
                <p><strong>Puntaje manual:</strong> {r.puntaje_manual ?? 'Sin calificar'}</p>
                {r.comentario_manual && (
                  <p><strong>Comentario manual:</strong> {r.comentario_manual}</p>
                )}
              </div>
            ))}
          </div>
        ))
      )}

      <button onClick={onVolver} style={{ marginTop: '20px' }}>
        Volver
      </button>
    </div>
  );
}

export default Historial;
