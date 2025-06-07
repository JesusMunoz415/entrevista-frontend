import React, { useState } from 'react';

function RegistroForm({ onRegistrado }) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMensaje('');

    if (!nombre || !email || !password) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    try {
      const response = await fetch('http://localhost/sistema-entrevistas/backend/api/crear_entrevistador.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, password })
      });

      const data = await response.json();
      if (data.status === 'ok') {
        setMensaje('✅ Entrevistador registrado correctamente.');
        setNombre('');
        setEmail('');
        setPassword('');
        if (onRegistrado) onRegistrado(data.id); // callback opcional
      } else {
        setError(data.mensaje || 'Ocurrió un error al registrar.');
      }
    } catch (err) {
      console.error(err);
      setError('No se pudo conectar con el servidor.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h2>Registrar nuevo entrevistador</h2>

      <label>Nombre completo:</label>
      <input
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
      />

      <label>Email:</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
      />

      <label>Contraseña:</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
      />

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}

      <button type="submit" style={{
        padding: '10px 20px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        width: '100%'
      }}>
        Registrar entrevistador
      </button>
    </form>
  );
}

export default RegistroForm;
