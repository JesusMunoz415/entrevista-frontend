import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

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

const palabrasClave = [
  ["desarrollador", "tecnologías", "compromiso"],
  ["motivación", "creciendo", "aprendiendo"],
  ["logro", "liderar", "gestión", "proyecto"],
  ["presión", "calma", "priorizar", "planificación"],
  ["colaboración", "equipo", "soluciones"],
  ["objetivo", "liderazgo", "creciendo"],
  ["responsabilidad", "experiencia", "adapto", "confiable"],
  ["frameworks", "trabajado", "desarrolló"]
];

function Result() {
  const location = useLocation();
  const {
    answers = [],
    entrevistadorId,
    postulanteId,
    entrevistaId
  } = location.state || {};

  const [analysis, setAnalysis] = useState('');
  const [manualScores, setManualScores] = useState(Array(8).fill(0));
  const [enviado, setEnviado] = useState(false);

  useEffect(() => {
    const evaluarRespuestas = (answers) => {
      const puntuaciones = answers.map((respuesta, i) => {
        let score = 0;
        const texto = respuesta.toLowerCase();

        if (respuesta.trim().length > 50) score += 1;
        if (palabrasClave[i].some(palabra => texto.includes(palabra))) score += 1;

        return { pregunta: i + 1, texto: respuesta, puntaje: score };
      });

      const total = puntuaciones.reduce((acc, p) => acc + p.puntaje, 0);
      const resultadoFinal = total >= 12
        ? "✅ APTO para la siguiente fase."
        : "⚠️ Se recomienda una revisión más detallada.";

      let informe = "📊 Evaluación automática:\n\n";
      puntuaciones.forEach(p => {
        informe += `Pregunta ${p.pregunta}: ${p.puntaje}/2\n`;
      });
      informe += `\n➡️ Resultado final: ${resultadoFinal}`;
      return informe;
    };

    if (answers.length === 8) {
      const resultado = evaluarRespuestas(answers);
      setAnalysis(resultado);
    }
  }, [answers]);

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
      evaluacion_automatica: extractEvalDePregunta(analysis, i + 1) || "",
      puntaje_manual: manualScores[i],
      comentario_manual: "",
      fecha: new Date()
    }));

    const datos = {
      entrevista_id: entrevistaId,
      respuestas: respuestasEvaluadas
    };

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
    const regex = new RegExp(`Pregunta ${preguntaId}: (\\d+/2)`);
    const match = analysisText.match(regex);
    return match ? match[0] : "Sin análisis";
  };

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
    </div>
  );
}

export default Result;
