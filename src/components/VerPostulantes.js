import React, { useEffect, useState } from 'react';

const VerPostulantes = () => {
  const [postulantes, setPostulantes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPostulantes = async () => {
      try {
        const response = await fetch('https://entrevista-backend.onrender.com/api/postulantes');
        const data = await response.json();
        setPostulantes(data);
      } catch (err) {
        console.error('❌ Error al cargar postulantes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPostulantes();
  }, []);

  if (loading) {
    return <p>⏳ Cargando lista de postulantes...</p>;
  }

  if (postulantes.length === 0) {
    return <p>📭 No hay postulantes registrados aún.</p>;
  }

  return (
    <div>
      <h2>🧑‍💼 Lista de Postulantes</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Fecha de Registro</th>
            <th>Correo</th>
            <th>Teléfono</th>
          </tr>
        </thead>
        <tbody>
          {postulantes.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.nombre}</td>
              <td>{new Date(p.creado_en).toLocaleDateString()}</td>
              <td>{p.correo || 'N/A'}</td>
              <td>{p.telefono || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px'
  },
  th: {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '10px'
  },
  td: {
    border: '1px solid #dee2e6',
    padding: '8px',
    textAlign: 'center'
  }
};

export default VerPostulantes;
