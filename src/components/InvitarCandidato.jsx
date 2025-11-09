import React, { useState } from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Send as SendIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import api from '../utils/axiosConfig';

// Este componente recibe la lista de plantillas como una 'prop'
function InvitarCandidato({ plantillas, onEnlaceGenerado }) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [plantillaId, setPlantillaId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    if (!plantillaId) {
      setError('Debes seleccionar una plantilla.');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/candidatos/invitar', { 
        nombre, 
        email, 
        plantillaId 
      });

      // Llamamos a la función del padre para mostrar el enlace
      onEnlaceGenerado(response.data.enlace);

      // Limpiar formulario
      setNombre('');
      setEmail('');
      setPlantillaId('');

    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al invitar al candidato.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}
    >
      <Typography variant="h6" gutterBottom>
        Invitar Candidato
      </Typography>

      <TextField
        label="Nombre del Candidato"
        variant="outlined"
        fullWidth
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
        disabled={loading}
        InputProps={{
          startAdornment: <PersonIcon sx={{ mr: 1, color: 'action.active' }} />,
        }}
      />

      <TextField
        label="Email del Candidato"
        type="email"
        variant="outlined"
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={loading}
        InputProps={{
          startAdornment: <EmailIcon sx={{ mr: 1, color: 'action.active' }} />,
        }}
      />

      <FormControl fullWidth required disabled={loading}>
        <InputLabel>Seleccionar Plantilla</InputLabel>
        <Select
          value={plantillaId}
          onChange={(e) => setPlantillaId(e.target.value)}
          label="Seleccionar Plantilla"
          startAdornment={<AssignmentIcon sx={{ mr: 1, color: 'action.active' }} />}
        >
          <MenuItem value="">
            <em>-- Elige una plantilla --</em>
          </MenuItem>
          {plantillas.map(p => (
            <MenuItem key={p?.id} value={p?.id}>
              {p.titulo}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {error && (
        <Alert severity="error">
          {error}
        </Alert>
      )}

      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={loading}
        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
      >
        {loading ? 'Generando Invitación...' : 'Generar Invitación'}
      </Button>
    </Box>
  );
}

export default InvitarCandidato;