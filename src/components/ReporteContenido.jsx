import React from 'react';

const ReporteContenido = React.forwardRef(({ resultados, handleAnalizar }, ref) => {
  // El botón de "Generar Reporte" debe estar aquí para que se imprima
  const botonAnalizar = (
    <button onClick={handleAnalizar}>Generar Reporte de IA</button>
  );

  return (
    <div ref={ref} style={{ padding: '20px' }}>
      <h2>Resultados de la Entrevista</h2>
      <p><strong>Candidato:</strong> {resultados?.candidato_nombre || 'Nombre no disponible'}</p>
      <hr />
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f5f5f5', color: 'black' }}>
        <h4>Reporte General de IA (Simulado)</h4>
        {resultados.evaluacion_ia ? (
          <div>
            <p><strong>Sentimiento General:</strong> {resultados.evaluacion_ia.sentimientoGeneral}</p>
            <p><strong>Conceptos Clave:</strong> {resultados.evaluacion_ia.conceptosClave.join(', ')}</p>
            <p><strong>Resumen de Claridad:</strong> {resultados.evaluacion_ia.resumenClaridad}</p>
          </div>
        ) : (
          botonAnalizar
        )}
      </div>
      <hr />
      <h3>Preguntas y Respuestas Individuales</h3>
      {resultados.resultados.map((item, index) => (
        <div key={item?.id || index} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
          <p><strong>Pregunta:</strong> {item.pregunta}</p>
          <p><strong>Respuesta:</strong> {item.respuesta}</p>
        </div>
      ))}
    </div>
  );
});

export default ReporteContenido;