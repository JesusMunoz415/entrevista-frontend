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
import EntrevistaPostulante from './components/EntrevistaPostulante';

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
          <Route
            path="/"
            element={
              <>
                {pantalla === "login" && (
                  <LoginForm onLoginExitoso={handleLogin} setPantalla={setPantalla} />
                )}

                {pantalla === "registro" && (
                  <RegistroEntrevistador onVolver={() => setPantalla("login")} />
                )}

                {pantalla === "dashboard" && (
                  <Dashboard entrevistadorId={entrevistadorId} />
                )}

                {pantalla === "formulario" && (
                  <QuestionForm
                    onSubmit={handleFormSubmit}
                    entrevistadorId={entrevistadorId}
                    postulanteId={postulanteId}
                  />
                )}

                {pantalla === "resultado" && (
                  <Result
                    analysis={analysis}
                    answers={answers}
                    onBack={handleBack}
                    entrevistadorId={entrevistadorId}
                    postulanteId={postulanteId}
                  />
                )}

                {pantalla === "historial" && (
                  <Historial entrevistadorId={entrevistadorId} onVolver={() => setPantalla("dashboard")} />
                )}
              </>
            }
          />

          {/* ✅ Ruta directa para acceder a InicioForm */}
          <Route
            path="/inicioform"
            element={<InicioForm onContinue={handleInicio} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
