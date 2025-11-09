import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import api from '../utils/axiosConfig';
import PlantillaForm from '../components/PlantillaForm'; // Reutilizamos el formulario

function EditarPlantillaPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plantilla, setPlantilla] = useState(null);

  useEffect(() => {
    const cargarPlantilla = async () => {
      const response = await api.get(`/plantillas/${id}`);
      setPlantilla(response.data);
    };
    cargarPlantilla();
  }, [id]);

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
        Editar Plantilla de Entrevista
      </Typography>
      
      {plantilla ? (
        <PlantillaForm plantillaExistente={plantilla} />
      ) : (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
}

export default EditarPlantillaPage;