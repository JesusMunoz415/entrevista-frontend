import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, CircularProgress, List, ListItem, ListItemText, Alert } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import api from '../utils/axiosConfig';

function PlantillaDetailPage() {
  // useParams nos permite leer los parámetros de la URL, como el :id
  const { id } = useParams();
  const navigate = useNavigate();
  const [plantilla, setPlantilla] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDetalles = async () => {
      try {
        // Usamos el 'id' de la URL para construir la petición
        const response = await api.get(`/plantillas/${id}`);
        setPlantilla(response.data);
      } catch (error) {
        console.error('Error al cargar los detalles de la plantilla', error);
      } finally {
        setLoading(false);
      }
    };

    cargarDetalles();
  }, [id]); // El efecto se vuelve a ejecutar si el ID de la URL cambia

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!plantilla) {
    return (
      <Box>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/dashboard')}
          sx={{ mb: 2 }}
        >
          Volver al Home
        </Button>
        <Alert severity="error">No se encontró la plantilla.</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/dashboard')}
        sx={{ mb: 2 }}
      >
        Volver al Home
      </Button>
      
      <Typography variant="h4" component="h2" gutterBottom>
        Detalles de: {plantilla.titulo}
      </Typography>

      <Typography variant="h6" component="h4" sx={{ mt: 3, mb: 2 }}>
        Preguntas:
      </Typography>
      
      {plantilla.preguntas && plantilla.preguntas.length > 0 ? (
        <List>
          {plantilla.preguntas.map(pregunta => (
            <ListItem key={pregunta?.id}>
              <ListItemText primary={pregunta.texto} />
            </ListItem>
          ))}
        </List>
      ) : (
        <Alert severity="info">Esta plantilla aún no tiene preguntas.</Alert>
      )}
    </Box>
  );
}

export default PlantillaDetailPage;