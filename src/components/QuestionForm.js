import React, { useState } from 'react';
import { useParams } from 'react-router-dom'; // 👈 importar useParams

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

function QuestionForm({ onSubmit }) {
  const { token } = useParams(); // 👈 obtenemos el token desde la URL
  const [answers, setAnswers] = useState(Array(8).fill(''));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (answers.some(answer => answer.trim() === '')) {
      setError('Por favor, responde todas las preguntas.');
      setLoading(false);
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const result = evaluarRespuestas(answers);

      // 👇 Llama a onSubmit para flujo actual
      onSubmit(result, answers);

      // 🚀 Actualiza estado de entrevista en el backend
      const response = await fetch(`https://entrevista-backend.onrender.com/api/entrevistas/${token}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: 'completada' })
      });

      if (!response.ok) {
        throw new Error('Error al actualizar estado de entrevista.');
      }

      alert('✅ Respuestas guardadas y entrevista marcada como completada.');
    } catch (err) {
      console.error(err);
      setError('❌ Hubo un error al enviar las respuestas.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {questions.map((question, i) => (
        <div key={i} style={{ marginBottom: '10px' }}>
          <label>{question}</label><br />
          <textarea
            rows={3}
            style={{ width: '100%' }}
            value={answers[i]}
            onChange={(e) => handleInputChange(i, e.target.value)}
            required
            disabled={loading}
          />
        </div>
      ))}

      <button type="submit" disabled={loading} style={{ marginTop: '10px' }}>
        {loading ? 'Evaluando...' : 'Enviar respuestas'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}

export default QuestionForm;
