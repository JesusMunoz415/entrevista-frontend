// frontend/src/App.js

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // ✅ Añadir esto
import LoginForm from './components/LoginForm';
import RegistroEntrevistador from './components/RegistroEntrevistador';
import InicioForm from './components/InicioForm';
import QuestionForm from './components/QuestionForm';
import Result from './components/Result';
import Historial from './components/Historial';
import Dashboard from './components/Dashboard';

function App() {
  const [entrevistadorId, setEntrevistadorId] = useState(null);
  const [nombreEntrevistador, setNombreEntrevistador] = useState('');
  const [postulanteId, setPostulanteId] = useState(null);
  const [analysis, setAnalysis] = useState('');
  const [answers, setAnswers] = useState([]);

  // ✅ Recuperar datos del entrevistador si existen en localStorage
  useEffect(() => {
    const id = localStorage.getItem('entrevistadorId');
    const nombre = localStorage.getItem('nombreEntrevistador');
    if (id && nombre) {
      setEntrevistadorId(id);
      setNombreEntrevistador(nombre);
    }
  }, []);

  const handleLogin = (id, nombre) => {
    localStorage.setItem('entrevistadorId', id); // ✅ Guardar en localStorage
    localStorage.setItem('nombreEntrevistador', nombre);
    setEntrevistadorId(id);
    setNombreEntrevistador(nombre);
    window.location.href = "/dashboard";
  };

  const handleInicio = (postId) => {
    setPostulanteId(postId);
    window.location.href = `/entrevista/${postId}`;
  };

  const handleFormSubmit = (result, respuestasUsuario) => {
    setAnalysis(result);
    setAnswers(respuestasUsuario);
    window.location.href = "/resultado";
  };

  const handleBack = () => {
    setAnalysis('');
    setAnswers([]);
    setPostulanteId(null);
    window.location.href = "/dashboard";
  };

  return (
    <Router>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <h1>Entrevista Inteligente RH</h1>

        {entrevistadorId && (
          <div style={{ textAlign: 'right', marginBottom: '10px' }}>
            <p><strong>Sesión:</strong> {nombreEntrevistador}</p>
            <button
              onClick={() => {
                localStorage.clear();
                setEntrevistadorId(null);
                setNombreEntrevistador('');
                setPostulanteId(null);
                window.location.href = '/';
              }}
              style={{ padding: '6px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '6px' }}
            >
              Cerrar sesión
            </button>
          </div>
        )}

        <Routes>
          <Route path="/" element={<LoginForm onLoginExitoso={handleLogin} />} />
          <Route path="/registro" element={<RegistroEntrevistador onVolver={() => window.location.href = '/'} />} />
          <Route path="/dashboard" element={<Dashboard entrevistadorId={entrevistadorId} />} />
          <Route path="/inicioform" element={<InicioForm onContinue={handleInicio} entrevistadorId={entrevistadorId} />} />
          <Route path="/entrevista/:postulanteId" element={<QuestionForm onSubmit={handleFormSubmit} entrevistadorId={entrevistadorId} postulanteId={postulanteId} />} />
          <Route path="/resultado" element={<Result analysis={analysis} answers={answers} onBack={handleBack} entrevistadorId={entrevistadorId} postulanteId={postulanteId} />} />
          <Route path="/historial" element={<Historial entrevistadorId={entrevistadorId} onVolver={() => window.location.href = '/dashboard'} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
