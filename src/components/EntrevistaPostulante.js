//frontend/src/components/EntrevistaPostulante.js

import React, { useState, useEffect } from 'react';
import QuestionForm from './QuestionForm';
import { useParams } from 'react-router-dom';

const EntrevistaPostulante = () => {
  const { token } = useParams();
  const [entrevista, setEntrevista] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEntrevista = async () => {
      try {
        const response = await fetch(`https://entrevista-backend.onrender.com/api/entrevistas/${token}`);
        const data = await response.json();

        if (data.status === 'ok') {
          setEntrevista(data.entrevista);
        } else {
          setError('❌ Entrevista no encontrada o ya completada.');
        }
      } catch (err) {
        console.error(err);
        setError('❌ Error al conectar con el servidor.');
      }
    };

    fetchEntrevista();
  }, [token]);

  const handleRespuestas = async (resultado, respuestas) => {
    try {
      await fetch(`https://entrevista-backend.onrender.com/api/entrevistas/${token}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          estado: 'completada'
        })
      });

      alert('✅ Respuestas guardadas y entrevista completada.');
    } catch (err) {
      console.error(err);
      alert('❌ Error al guardar respuestas.');
    }
  };

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!entrevista) {
    return <p>🔄 Cargando entrevista...</p>;
  }

  return (
    <div>
      <h2>📝 Entrevista para el postulante</h2>
      <p><strong>Postulante ID:</strong> {entrevista.postulante_id}</p>
      <p><strong>Fecha:</strong> {entrevista.fecha}</p>
      <QuestionForm onSubmit={handleRespuestas} />
    </div>
  );
};

export default EntrevistaPostulante;
