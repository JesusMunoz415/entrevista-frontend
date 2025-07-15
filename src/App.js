// frontend/src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegistroEntrevistador from './components/RegistroEntrevistador';
import InicioForm from './components/InicioForm';
import QuestionForm from './components/QuestionForm';
import Result from './components/Result';
import Historial from './components/Historial';
import Dashboard from './components/Dashboard';

function App() {
  const [pantalla, setPantalla] = useState("login");
  const [entrevistadorId, setEntrevistadorId] = useState(null);
  const [nombreEntrevistador, setNombreEntrevistador] = useState('');
  const [postulanteId, setPostulanteId] = useState(null);
  const [analysis, setAnalysis] = useState('');
  const [answers, setAnswers] = useState([]);

  const handleLogin = (id, nombre) => {
    setEntrevistadorId(id);
    setNombreEntrevistador(nombre);
    setPantalla("dashboard");
  };

  const handleInicio = (postId) => {
    setPostulanteId(postId);
    setPantalla("formulario");
  };

  const handleFormSubmit = (result, respuestasUsuario) => {
    setAnalysis(result);
    setAnswers(respuestasUsuario);
    setPantalla("resultado");
  };

  const handleBack = () => {
    setAnalysis('');
    setAnswers([]);
    setPostulanteId(null);
    setPantalla("dashboard");
  };

  const cerrarSesion = () => {
    localStorage.clear();
    setEntrevistadorId(null);
    setNombreEntrevistador('');
    setPostulanteId(null);
    setPantalla("login");
  };

  return (
    <Router>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <h1>Entrevista Inteligente RH</h1>

        {entrevistadorId && (
          <div style={{ textAlign: 'right', marginBottom: '10px' }}>
            <p><strong>Sesión:</strong> {nombreEntrevistador}</p>
            <button onClick={cerrarSesion} style={{ padding: '6px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '6px' }}>
              Cerrar sesión
            </button>
            <button onClick={() => setPantalla("historial")} style={{ marginLeft: '10px', padding: '6px 12px' }}>
              Ver historial
            </button>
          </div>
        )}

        <Routes>
          <Route path="/" element={<LoginForm onLoginExitoso={handleLogin} setPantalla={setPantalla} />} />
          <Route path="/registro" element={<RegistroEntrevistador onVolver={() => setPantalla("login")} />} />
          <Route path="/dashboard" element={<Dashboard entrevistadorId={entrevistadorId} />} />
          <Route path="/formulario" element={<QuestionForm onSubmit={handleFormSubmit} entrevistadorId={entrevistadorId} postulanteId={postulanteId} />} />
          <Route path="/resultado" element={<Result analysis={analysis} answers={answers} onBack={handleBack} entrevistadorId={entrevistadorId} postulanteId={postulanteId} />} />
          <Route path="/historial" element={<Historial entrevistadorId={entrevistadorId} onVolver={() => setPantalla("dashboard")} />} />
          <Route path="/entrevista/:token" element={<InicioForm onContinue={handleInicio} entrevistadorId={entrevistadorId} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
