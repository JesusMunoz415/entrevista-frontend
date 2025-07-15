import React from 'react';

function Dashboard({ entrevistadorId }) {
  const nombreEntrevistador = localStorage.getItem("nombreEntrevistador");

  const handleGestionarEntrevistas = () => {
    alert("🔧 Aquí irá la gestión de entrevistas");
  };

  const handleVerPostulantes = () => {
    alert("🧑‍💼 Aquí irá la lista de postulantes");
  };

  const handleVerHistorial = () => {
    alert("📜 Aquí irá el historial de entrevistas");
  };

  const handleConfiguracion = () => {
    alert("⚙️ Aquí irá la configuración de la cuenta");
  };

  const handleCerrarSesion = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🎯 Entrevista Inteligente RH</h1>

      <div style={styles.card}>
        <h2 style={styles.welcome}>👋 Bienvenido, <span style={styles.username}>{nombreEntrevistador}</span></h2>
        <p style={styles.subtext}>ID de entrevistador: <strong>{entrevistadorId}</strong></p>

        <div style={styles.buttonGroup}>
          <button onClick={handleGestionarEntrevistas} style={styles.button}>
            📁 Gestionar Entrevistas
          </button>
          <button onClick={handleVerPostulantes} style={styles.button}>
            🧑‍💼 Ver Postulantes
          </button>
          <button onClick={handleVerHistorial} style={styles.button}>
            📜 Ver Historial
          </button>
          <button onClick={handleConfiguracion} style={styles.button}>
            ⚙️ Configuración
          </button>
          <button onClick={handleCerrarSesion} style={{ ...styles.button, ...styles.logoutButton }}>
            🚪 Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '90vh',
    background: 'linear-gradient(135deg, #f0f2f5, #d9e4f5)',
    fontFamily: 'Arial, sans-serif'
  },
  title: {
    position: 'absolute',
    top: '30px',
    textAlign: 'center',
    fontSize: '2.5rem',
    color: '#343a40'
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
    textAlign: 'center',
    width: '90%',
    maxWidth: '500px'
  },
  welcome: {
    fontSize: '1.8rem',
    marginBottom: '10px',
    color: '#212529'
  },
  username: {
    color: '#007bff'
  },
  subtext: {
    fontSize: '1rem',
    color: '#6c757d',
    marginBottom: '20px'
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  button: {
    padding: '12px 20px',
    fontSize: '1rem',
    borderRadius: '8px',
    border: '1px solid #007bff',
    backgroundColor: '#007bff',
    color: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    border: '1px solid #dc3545'
  }
};

export default Dashboard;
