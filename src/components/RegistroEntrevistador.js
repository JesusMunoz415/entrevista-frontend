// frontend/src/components/RegistroEntrevistador.js
import React, { useState } from 'react';

function RegistroEntrevistador({ onVolver }) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setExito(false);

    if (!nombre || !email || !password) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    try {
      const response = await fetch('https://entrevista-backend.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, password })
      });

      const data = await response.json();

      if (data.status === 'ok' || data.mensaje === 'Registro exitoso') {
        setExito(true);
      } else {
        setError(data.mensaje || 'Error al registrar.');
      }
    } catch (err) {
      console.error(err);
      setError('Error de conexión con el servidor.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h2>Crear cuenta de entrevistador</h2>

      <label>Nombre:</label>
      <input value={nombre} onChange={(e) => setNombre(e.target.value)} style={{ width: '100%' }} />

      <label>Email:</label>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%' }} />

      <label>Contraseña:</label>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%' }} />

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {exito && <p style={{ color: 'green' }}>✅ Registrado correctamente</p>}

      <button type="submit" style={{ marginTop: '10px' }}>Registrar</button>
      <button type="button" onClick={onVolver} style={{ marginTop: '10px', marginLeft: '10px' }}>Volver</button>
    </form>
  );
}

export default RegistroEntrevistador;
