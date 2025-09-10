// frontend/src/components/Result.js
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // ✅ importados

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

function Result() {
  const location = useLocation(); // ✅ recibe datos desde navigate
  const navigate = useNavigate();

  // ✅ Extraer datos que mandamos desde QuestionForm
  const { resultado, respuestas } = location.state || {};
  const query = new URLSearchParams(location.search);
  const entrevistaId = query.get("entrevistaId"); // tomado de la URL

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
      texto: respuestas?.[i] || "",
      evaluacion_automatica: extractEvalDePregunta(resultado, i + 1) || "",
      puntaje_manual: manualScores[i],
      comentario_manual: "",
      fecha: new Date()
    }));

    const datos = {
      entrevista_id: entrevistaId,
      respuestas: respuestasEvaluadas
    };

    console.log("✅ Datos enviados al backend:", JSON.stringify(datos, null, 2));
    try {
      const response = await fetch('https://entrevista-backend.onrender.com/api/respuestas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      });

      const result = await response.json();

      if (response.ok) {
        setEnviado(true);
        alert("✅ Evaluación guardada correctamente.");
      } else {
        console.error("⚠️ Respuesta del backend:", result);
        alert(`⚠️ Hubo un problema al guardar: ${result.mensaje || 'Error desconocido'}`);
      }
    } catch (err) {
      console.error("❌ Error al enviar al backend:", err);
      alert("❌ Error de conexión con el backend.");
    }
  };

  const extractEvalDePregunta = (analysisText, preguntaId) => {
    return analysisText || "Sin análisis"; // 👈 Valor por defecto
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px' }}>
      <h2>Análisis Automático</h2>
      <div style={{
        backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '10px',
        whiteSpace: 'pre-wrap', marginBottom: '30px'
      }}>
        {resultado}
      </div>

      <h3>📋 Evaluación Manual</h3>
      {questions.map((q, i) => (
        <div key={i} style={{ marginBottom: '20px' }}>
          <strong>{q}</strong>
          <div style={{ backgroundColor: '#eee', padding: '10px' }}>
            {respuestas?.[i] || "Sin respuesta"}
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

      <button onClick={() => navigate(-1)} style={{ marginTop: '10px', marginLeft: '10px' }}>
        Volver
      </button>
    </div>
  );
}

export default Result;
