import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PlantillaForm from '../components/PlantillaForm'; // <-- Importa el form

function CrearPlantillaPage() {
  const navigate = useNavigate();

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/dashboard')}
        sx={{ mb: 2 }}
      >
        Volver al Home
      </Button>
      
      <PlantillaForm /> {/* <-- Usa el form */}
    </Box>
  );
}

export default CrearPlantillaPage;