// File: frontend/src/components/LoginForm.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Import agregado

function LoginForm({ onLoginExitoso }) { // ya no necesitas setPantalla
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate(); // ✅ Definir navigate

  useEffect(() => {
    const id = localStorage.getItem("entrevistadorId");
    const nombre = localStorage.getItem("nombreEntrevistador");
    if (id && nombre) {
      onLoginExitoso(parseInt(id), nombre);
    }
  }, [onLoginExitoso]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    try {
      const response = await fetch('https://entrevista-backend.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.status === 'ok' || data.mensaje === 'Login exitoso') {
        localStorage.setItem("entrevistadorId", data.id);
        localStorage.setItem("nombreEntrevistador", data.nombre);
        onLoginExitoso(data.id, data.nombre);
      } else {
        setError(data.mensaje || 'Error al iniciar sesión.');
      }
    } catch (err) {
      console.error(err);
      setError('No se pudo conectar con el servidor.');
    }
  };

  return (
    <form onSubmit={handleLogin} style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h2>Iniciar sesión</h2>

      <label>Email:</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{ width: '100%' }}
      />

      <label>Contraseña:</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        style={{ width: '100%' }}
      />

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button type="submit" style={{ marginTop: '10px' }}>Entrar</button>
      <p>
        ¿No tienes cuenta?{" "}
        <button
          type="button"
          onClick={() => navigate("/registro")} // ✅ Ahora funciona
          style={{ color: '#007bff', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          Crear cuenta
        </button>
      </p>
    </form>
  );
}

export default LoginForm;
