import React, { useState } from 'react';
import LoginForm from './components/LoginForm';
import RegistroEntrevistador from './components/RegistroEntrevistador';
import InicioForm from './components/InicioForm';
import QuestionForm from './components/QuestionForm';
import Result from './components/Result';
import Historial from './components/Historial';

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
    setPantalla("inicio");
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
    setPantalla("inicio");
  };

  const cerrarSesion = () => {
    localStorage.clear();
    setEntrevistadorId(null);
    setNombreEntrevistador('');
    setPostulanteId(null);
    setPantalla("login");
  };

  return (
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

      {pantalla === "login" && (
        <LoginForm onLoginExitoso={handleLogin} setPantalla={setPantalla} />
      )}

      {pantalla === "registro" && (
        <RegistroEntrevistador onVolver={() => setPantalla("login")} />
      )}

      {pantalla === "inicio" && (
        <InicioForm onContinue={handleInicio} entrevistadorId={entrevistadorId} />
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
        <Historial entrevistadorId={entrevistadorId} onVolver={() => setPantalla("inicio")} />
      )}
    </div>
  );
}

export default App;
