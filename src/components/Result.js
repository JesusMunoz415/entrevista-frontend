import React, { useState } from 'react';

const questions = [
  "Cuéntame un poco sobre ti.",
  "¿Por qué te interesa este puesto de desarrollador?",
  "¿Cuál consideras que ha sido tu mayor logro profesional?",
  "¿Cómo manejas situaciones de presión en el trabajo?",
  "¿Prefieres trabajar solo o en equipo? ¿Por qué?",
  "¿Dónde te ves profesionalmente dentro de 5 años?",
  "¿Por qué deberíamos contratarte para este puesto?",
  "¿Tienes experiencia previa relacionada con este tipo de trabajo?"
];

function Result({ analysis, answers, onBack, postulanteId, entrevistadorId }) {
  const [manualScores, setManualScores] = useState(Array(8).fill(0));
  const [enviado, setEnviado] = useState(false);

  const total = manualScores.reduce((a, b) => a + b, 0);
  const resultadoFinal = total >= 12
    ? "✅ APTO para la siguiente fase."
    : "⚠️ Revisión recomendada.";

  const handleManualScore = (index, value) => {
    const newScores = [...manualScores];
    newScores[index] = parseInt(value);
    setManualScores(newScores);
  };

  const guardarEnBase = async () => {
    const respuestasEvaluadas = questions.map((q, i) => ({
      pregunta_id: i + 1,
      texto: answers[i] || "",
      evaluacion_automatica: extractEvalDePregunta(analysis, i + 1),
      puntaje_manual: manualScores[i],
      comentario_manual: ""
    }));

    const datos = {
      postulante_id: postulanteId,
      entrevistador_id: entrevistadorId,
      respuestas: respuestasEvaluadas
    };

    try {
      const response = await fetch('http://localhost:3001/api/respuestas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });

      const result = await response.json();

      if (result.status === 'ok') {
        setEnviado(true);
        alert("✅ Evaluación guardada correctamente.");
      } else {
        alert("⚠️ Hubo un problema al guardar.");
      }
    } catch (err) {
      console.error("❌ Error al enviar al backend:", err);
      alert("❌ Error de conexión con el backend.");
    }
  };

  const extractEvalDePregunta = (analysisText, preguntaId) => analysisText;

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px' }}>
      <h2>Análisis Automático</h2>
      <div style={{
        backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '10px',
        whiteSpace: 'pre-wrap', marginBottom: '30px'
      }}>
        {analysis}
      </div>

      <h3>📋 Evaluación Manual</h3>
      {questions.map((q, i) => (
        <div key={i} style={{ marginBottom: '20px' }}>
          <strong>{q}</strong>
          <div style={{ backgroundColor: '#eee', padding: '10px' }}>
            {answers[i]}
          </div>
          <label>Puntuación (0-2): </label>
          <select
            value={manualScores[i]}
            onChange={(e) => handleManualScore(i, e.target.value)}
          >
            <option value={0}>0</option>
            <option value={1}>1</option>
            <option value={2}>2</option>
          </select>
        </div>
      ))}

      <h4>Total: {total} / 16</h4>
      <p><strong>Resultado:</strong> {resultadoFinal}</p>

      {!enviado && (
        <button onClick={guardarEnBase} style={{ marginTop: '10px' }}>
          Guardar evaluación
        </button>
      )}

      <button onClick={onBack} style={{ marginTop: '10px', marginLeft: '10px' }}>
        Volver
      </button>
    </div>
  );
}

export default Result;
