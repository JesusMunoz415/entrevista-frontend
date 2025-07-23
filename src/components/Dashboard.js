import React, { useState } from 'react';
import VerPostulantes from './VerPostulantes'; // ✅ Importa archivo externo
import GestionarEntrevistas from './GestionarEntrevistas';
import InicioForm from './InicioForm'; // ✅ Importa InicioForm

function Dashboard({ entrevistadorId }) {
  const nombreEntrevistador = localStorage.getItem("nombreEntrevistador");
  const [vista, setVista] = useState("home");

  const handleCerrarSesion = () => {
    localStorage.clear();
    window.location.reload();
  };

  const renderContenido = () => {
    switch (vista) {
      case "entrevistas":
        // ✅ Ahora carga InicioForm en lugar de GestionarEntrevistas
        return <InicioForm />;
      case "postulantes":
        return <VerPostulantes />;
      case "historial":
        return <VerHistorial />;
      case "configuracion":
        return <Configuracion />;
      default:
        return (
          <div>
            <h2 style={styles.welcome}>👋 Bienvenido, <span style={styles.username}>{nombreEntrevistador}</span></h2>
            <p style={styles.subtext}>ID de entrevistador: <strong>{entrevistadorId}</strong></p>
            <p style={{ marginTop: '20px', color: '#6c757d' }}>Selecciona una opción del menú para comenzar.</p>
          </div>
        );
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.sidebar}>
          <button onClick={() => setVista("entrevistas")} style={styles.menuButton}>
            📁 Gestionar Entrevistas
          </button>
          <button onClick={() => setVista("postulantes")} style={styles.menuButton}>
            🧑‍💼 Ver Postulantes
          </button>
          <button onClick={() => setVista("historial")} style={styles.menuButton}>
            📜 Ver Historial
          </button>
          <button onClick={() => setVista("configuracion")} style={styles.menuButton}>
            ⚙️ Configuración
          </button>
          <button onClick={handleCerrarSesion} style={{ ...styles.menuButton, ...styles.logoutButton }}>
            🚪 Cerrar sesión
          </button>
        </div>

        <div style={styles.content}>
          {renderContenido()}
        </div>
      </div>
    </div>
  );
}

// ⚠️ Subcomponentes temporales (mover a archivos externos después)
const VerHistorial = () => (
  <div>
    <h2>📜 Historial de Entrevistas</h2>
    <p>Aquí verás el historial completo de entrevistas.</p>
  </div>
);

const Configuracion = () => (
  <div>
    <h2>⚙️ Configuración</h2>
    <p>Aquí podrás actualizar tu perfil y contraseña.</p>
  </div>
);

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '90vh',
    background: 'linear-gradient(135deg, #f8f9fa, #d9e4f5)',
    fontFamily: 'Arial, sans-serif'
  },
  title: {
    position: 'absolute',
    top: '20px',
    fontSize: '2rem',
    color: '#343a40'
  },
  card: {
    display: 'flex',
    width: '90%',
    maxWidth: '1000px',
    height: '600px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
  },
  sidebar: {
    width: '250px',
    backgroundColor: '#f1f3f5',
    borderTopLeftRadius: '12px',
    borderBottomLeftRadius: '12px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  menuButton: {
    padding: '10px',
    fontSize: '1rem',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease'
  },
  logoutButton: {
    backgroundColor: '#dc3545'
  },
  content: {
    flexGrow: 1,
    padding: '30px',
    overflowY: 'auto'
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
    color: '#6c757d'
  }
};

export default Dashboard;
