import React, { useState } from 'react';
import VerPostulantes from './VerPostulantes';

function Dashboard({ entrevistadorId }) {
  const nombreEntrevistador = localStorage.getItem("nombreEntrevistador");
  const [vista, setVista] = useState("home");

  const handleCerrarSesion = () => {
    localStorage.clear();
    window.location.reload();
  };

  const renderContenido = () => {
    switch (vista) {
      case "postulantes":
        return <VerPostulantes />;
      case "home":
      default:
        return (
          <div>
            <h2>👋 Bienvenido, <span style={styles.username}>{nombreEntrevistador}</span></h2>
            <p>ID de entrevistador: <strong>{entrevistadorId}</strong></p>
            <p style={{ marginTop: '20px', color: '#6c757d' }}>Selecciona una opción del menú para comenzar.</p>
          </div>
        );
    }
  };

  return (
    <div style={styles.container}>

      <div style={styles.card}>
        <div style={styles.sidebar}>
          <button onClick={() => setVista("postulantes")} style={styles.menuButton}>
            🧑‍💼 Ver Postulantes
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
  username: {
    color: '#007bff'
  }
};

export default Dashboard;
