import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/axiosConfig';
import toast from 'react-hot-toast';
import GeneradorPreguntasIA from './GeneradorPreguntasIA';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  IconButton,
  Divider,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon
} from '@mui/icons-material';

function PlantillaForm({ plantillaExistente }) {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [titulo, setTitulo] = useState('');
  // El estado de las preguntas es un array de objetos complejos
  const [preguntas, setPreguntas] = useState([{ texto: '', modulo: 'Personalidad', opciones: [{ texto_opcion: '', puntos: 0 }] }]);
  const [error, setError] = useState('');
  const [mostrarGeneradorIA, setMostrarGeneradorIA] = useState(false);

  // Rellena el formulario si estamos en modo "Editar"
  useEffect(() => {
    if (plantillaExistente) {
      setTitulo(plantillaExistente.titulo);
      // Asegura que las preguntas y opciones existan antes de cargarlas
      if (plantillaExistente.preguntas && plantillaExistente.preguntas.length > 0) {
        setPreguntas(plantillaExistente.preguntas);
      }
    }
  }, [plantillaExistente]);

  // --- MANEJADORES DE ESTADO ---

  const handlePreguntaChange = (index, field, value) => {
    const nuevasPreguntas = [...preguntas];
    nuevasPreguntas[index][field] = value;
    setPreguntas(nuevasPreguntas);
  };

  const handleOpcionChange = (pregIndex, opcIndex, field, value) => {
    const nuevasPreguntas = [...preguntas];
    nuevasPreguntas[pregIndex].opciones[opcIndex][field] = value;
    setPreguntas(nuevasPreguntas);
  };

  const agregarPregunta = () => {
    setPreguntas([...preguntas, { texto: '', modulo: 'Personalidad', opciones: [{ texto_opcion: '', puntos: 0 }] }]);
  };

  const eliminarPregunta = (index) => {
    const nuevasPreguntas = [...preguntas];
    nuevasPreguntas.splice(index, 1);
    setPreguntas(nuevasPreguntas);
  };

  const agregarOpcion = (pregIndex) => {
    const nuevasPreguntas = [...preguntas];
    nuevasPreguntas[pregIndex].opciones.push({ texto_opcion: '', puntos: 0 });
    setPreguntas(nuevasPreguntas);
  };

  const eliminarOpcion = (pregIndex, opcIndex) => {
    const nuevasPreguntas = [...preguntas];
    nuevasPreguntas[pregIndex].opciones.splice(opcIndex, 1);
    setPreguntas(nuevasPreguntas);
  };

  // Manejar preguntas generadas por IA
  const handlePreguntasGeneradas = (preguntasIA) => {
    const preguntasFormateadas = preguntasIA.map(pregunta => ({
      texto: pregunta.texto,
      modulo: pregunta.modulo || 'Personalidad',
      opciones: pregunta.opciones || [{ texto_opcion: '', puntos: 0 }]
    }));
    
    setPreguntas(preguntasFormateadas);
    setMostrarGeneradorIA(false);
    toast.success(`${preguntasIA.length} preguntas agregadas exitosamente`);
  };

  // --- ENVÍO DEL FORMULARIO ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validaciones básicas
    if (!titulo.trim()) {
      setError('El título es obligatorio');
      return;
    }

    if (preguntas.length === 0) {
      setError('Debe agregar al menos una pregunta');
      return;
    }

    // Validar que todas las preguntas tengan texto
    for (let i = 0; i < preguntas.length; i++) {
      if (!preguntas[i].texto.trim()) {
        setError(`La pregunta ${i + 1} no puede estar vacía`);
        return;
      }
      
      // Validar que cada pregunta tenga al menos una opción válida
      const opcionesValidas = preguntas[i].opciones.filter(op => op.texto_opcion.trim());
      if (opcionesValidas.length === 0) {
        setError(`La pregunta ${i + 1} debe tener al menos una opción de respuesta`);
        return;
      }
    }

    try {
      const plantillaData = { titulo, preguntas };

      if (plantillaExistente) {
        // Modo edición
        await api.put(`/plantillas/${id}`, plantillaData);
        toast.success('Plantilla actualizada exitosamente');
      } else {
        // Modo creación
        await api.post('/plantillas', plantillaData);
        toast.success('Plantilla creada exitosamente');
      }

      navigate('/dashboard');
    } catch (error) {
      console.error('Error al guardar plantilla:', error);
      setError('Error al guardar la plantilla');
      toast.error('Error al guardar la plantilla');
    }
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {plantillaExistente ? 'Editar Plantilla' : 'Crear Nueva Plantilla'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Generador de Preguntas con IA */}
      {!mostrarGeneradorIA ? (
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Button
            variant="outlined"
            onClick={() => setMostrarGeneradorIA(true)}
            sx={{ mb: 2 }}
          >
            Generar Preguntas con IA
          </Button>
        </Box>
      ) : (
        <GeneradorPreguntasIA 
          onPreguntasGeneradas={handlePreguntasGeneradas}
        />
      )}

      <form onSubmit={handleSubmit}>
        {/* Título de la plantilla */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <TextField
              label="Título de la plantilla"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              fullWidth
              required
              placeholder="Ej: Evaluación para Desarrollador Frontend"
            />
          </CardContent>
        </Card>

        {/* Preguntas */}
        <Typography variant="h6" gutterBottom>
          Preguntas ({preguntas.length})
        </Typography>

        {preguntas.map((pregunta, pregIndex) => (
          <Card key={pregIndex} sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Pregunta {pregIndex + 1}</Typography>
                <IconButton 
                  onClick={() => eliminarPregunta(pregIndex)}
                  color="error"
                  disabled={preguntas.length === 1}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>

              <TextField
                label="Texto de la pregunta"
                value={pregunta.texto}
                onChange={(e) => handlePreguntaChange(pregIndex, 'texto', e.target.value)}
                fullWidth
                multiline
                rows={2}
                sx={{ mb: 2 }}
                required
              />

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Módulo</InputLabel>
                <Select
                  value={pregunta.modulo}
                  onChange={(e) => handlePreguntaChange(pregIndex, 'modulo', e.target.value)}
                  label="Módulo"
                >
                  <MenuItem value="Personalidad">Personalidad</MenuItem>
                  <MenuItem value="Lógica">Lógica</MenuItem>
                  <MenuItem value="Competencias">Competencias</MenuItem>
                </Select>
              </FormControl>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" gutterBottom>
                Opciones de respuesta
              </Typography>

              {pregunta.opciones.map((opcion, opcIndex) => (
                <Box key={opcIndex} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                  <TextField
                    label={`Opción ${opcIndex + 1}`}
                    value={opcion.texto_opcion}
                    onChange={(e) => handleOpcionChange(pregIndex, opcIndex, 'texto_opcion', e.target.value)}
                    fullWidth
                  />
                  <TextField
                    label="Puntos"
                    type="number"
                    value={opcion.puntos}
                    onChange={(e) => handleOpcionChange(pregIndex, opcIndex, 'puntos', parseInt(e.target.value) || 0)}
                    sx={{ width: 100 }}
                    inputProps={{ min: 0, max: 100 }}
                  />
                  <IconButton 
                    onClick={() => eliminarOpcion(pregIndex, opcIndex)}
                    color="error"
                    disabled={pregunta.opciones.length === 1}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}

              <Button
                onClick={() => agregarOpcion(pregIndex)}
                startIcon={<AddIcon />}
                size="small"
              >
                Agregar opción
              </Button>
            </CardContent>
          </Card>
        ))}

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 3 }}>
          <Button
            onClick={agregarPregunta}
            variant="outlined"
            startIcon={<AddIcon />}
          >
            Agregar Pregunta
          </Button>
        </Box>

        {/* Botones de acción */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            type="submit"
            variant="contained"
            startIcon={<SaveIcon />}
            size="large"
          >
            {plantillaExistente ? 'Actualizar Plantilla' : 'Crear Plantilla'}
          </Button>
          <Button
            onClick={() => navigate('/dashboard')}
            variant="outlined"
          >
            Cancelar
          </Button>
        </Box>
      </form>
    </Box>
  );
}

export default PlantillaForm;