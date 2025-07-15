import React from 'react';

function Dashboard({ entrevistadorId }) {
  const nombreEntrevistador = localStorage.getItem("nombreEntrevistador");

  const handleGestionarEntrevistas = () => {
    alert("🔧 Aquí irá la gestión de entrevistas");
    // Ej: setPantalla("gestionEntrevistas") si quieres navegar internamente
  };

  const handleVerPostulantes = () => {
    alert("🧑‍💼 Aquí irá la lista de postulantes");
    // Ej: setPantalla("postulantes")
  };

  const handleVerHistorial = () => {
    alert("📜 Aquí irá el historial de entrevistas");
    // Ej: setPantalla("historial")
  };

  const handleConfiguracion = () => {
    alert("⚙️ Aquí irá la configuración de la cuenta");
    // Ej: setPantalla("configuracion")
  };

  const handleCerrarSesion = () => {
    localStorage.clear();
    window.location.reload(); // Vuelve al login
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>👋 Bienvenido, {nombreEntrevistador}</h2>
      <p>ID de entrevistador: {entrevistadorId}</p>

      <div style={{ marginTop: '30px' }}>
        <button
          onClick={handleGestionarEntrevistas}
          style={buttonStyle}
        >
          📁 Gestionar Entrevistas
        </button>

        <button
          onClick={handleVerPostulantes}
          style={buttonStyle}
        >
          🧑‍💼 Ver Postulantes
        </button>

        <button
          onClick={handleVerHistorial}
          style={buttonStyle}
        >
          📜 Ver Historial
        </button>

        <button
          onClick={handleConfiguracion}
          style={buttonStyle}
        >
          ⚙️ Configuración
        </button>

        <button
          onClick={handleCerrarSesion}
          style={{ ...buttonStyle, backgroundColor: '#dc3545', color: 'white' }}
        >
          🚪 Cerrar sesión
        </button>
      </div>
    </div>
  );
}

const buttonStyle = {
  display: 'block',
  width: '80%',
  margin: '10px auto',
  padding: '12px',
  fontSize: '16px',
  borderRadius: '8px',
  border: '1px solid #007bff',
  backgroundColor: '#f8f9fa',
  cursor: 'pointer'
};

export default Dashboard;
