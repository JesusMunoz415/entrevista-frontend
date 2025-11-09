import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Psychology as PsychologyIcon,
  ExpandMore as ExpandMoreIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  ContentCopy as ContentCopyIcon
} from '@mui/icons-material';
import api from '../utils/axiosConfig';
import toast from 'react-hot-toast';

const GeneradorPreguntasIA = ({ onPreguntasGeneradas }) => {
  const [formData, setFormData] = useState({
    puesto: '',
    competencias: [],
    nivel: 'intermedio',
    cantidad: 10
  });
  const [competenciaInput, setCompetenciaInput] = useState('');
  const [preguntasGeneradas, setPreguntasGeneradas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const niveles = [
    { value: 'junior', label: 'Junior' },
    { value: 'intermedio', label: 'Intermedio' },
    { value: 'senior', label: 'Senior' },
    { value: 'ejecutivo', label: 'Ejecutivo' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const agregarCompetencia = () => {
    if (competenciaInput.trim() && !formData.competencias.includes(competenciaInput.trim())) {
      setFormData(prev => ({
        ...prev,
        competencias: [...prev.competencias, competenciaInput.trim()]
      }));
      setCompetenciaInput('');
    }
  };

  const eliminarCompetencia = (competencia) => {
    setFormData(prev => ({
      ...prev,
      competencias: prev.competencias.filter(c => c !== competencia)
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      agregarCompetencia();
    }
  };

  const generarPreguntas = async () => {
    if (!formData.puesto.trim()) {
      setError('El puesto es requerido');
      return;
    }

    if (formData.competencias.length === 0) {
      setError('Debe agregar al menos una competencia');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await api.post('/plantillas/generar-preguntas', {
        puesto: formData.puesto,
        competencias: formData.competencias,
        nivel: formData.nivel,
        cantidad: formData.cantidad
      });

      setPreguntasGeneradas(response.data.preguntas || []);
      toast.success('Preguntas generadas exitosamente');
    } catch (error) {
      console.error('Error al generar preguntas:', error);
      setError('Error al generar preguntas con IA');
      toast.error('Error al generar preguntas');
    } finally {
      setLoading(false);
    }
  };

  const copiarPregunta = (pregunta) => {
    navigator.clipboard.writeText(pregunta.texto);
    toast.success('Pregunta copiada al portapapeles');
  };

  const usarPreguntas = () => {
    if (onPreguntasGeneradas) {
      onPreguntasGeneradas(preguntasGeneradas);
    }
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <PsychologyIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6">
            Generador de Preguntas con IA
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Formulario de configuración */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Puesto de trabajo"
                value={formData.puesto}
                onChange={(e) => handleInputChange('puesto', e.target.value)}
                placeholder="Ej: Desarrollador Frontend, Gerente de Ventas..."
                fullWidth
                required
              />

              <Box>
                <TextField
                  label="Agregar competencia"
                  value={competenciaInput}
                  onChange={(e) => setCompetenciaInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ej: Liderazgo, Comunicación..."
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <IconButton onClick={agregarCompetencia} disabled={!competenciaInput.trim()}>
                        <AddIcon />
                      </IconButton>
                    )
                  }}
                />
                
                <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {formData.competencias.map((competencia, index) => (
                    <Chip
                      key={index}
                      label={competencia}
                      onDelete={() => eliminarCompetencia(competencia)}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>

              <FormControl fullWidth>
                <InputLabel>Nivel del puesto</InputLabel>
                <Select
                  value={formData.nivel}
                  onChange={(e) => handleInputChange('nivel', e.target.value)}
                  label="Nivel del puesto"
                >
                  {niveles.map((nivel) => (
                    <MenuItem key={nivel.value} value={nivel.value}>
                      {nivel.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Cantidad de preguntas"
                type="number"
                value={formData.cantidad}
                onChange={(e) => handleInputChange('cantidad', parseInt(e.target.value) || 10)}
                inputProps={{ min: 5, max: 50 }}
                fullWidth
              />

              <Button
                variant="contained"
                onClick={generarPreguntas}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <RefreshIcon />}
                size="large"
              >
                {loading ? 'Generando...' : 'Generar Preguntas'}
              </Button>
            </Box>
          </Grid>

          {/* Preguntas generadas */}
          <Grid item xs={12} md={6}>
            {preguntasGeneradas.length > 0 && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Preguntas Generadas ({preguntasGeneradas.length})
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={usarPreguntas}
                    size="small"
                  >
                    Usar estas preguntas
                  </Button>
                </Box>

                <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
                  {preguntasGeneradas.map((pregunta, index) => (
                    <Accordion key={index}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle2">
                          {pregunta.modulo} - Pregunta {index + 1}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                            <Typography variant="body2" sx={{ flex: 1 }}>
                              {pregunta.texto}
                            </Typography>
                            <Tooltip title="Copiar pregunta">
                              <IconButton 
                                size="small" 
                                onClick={() => copiarPregunta(pregunta)}
                              >
                                <ContentCopyIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                          
                          {pregunta.opciones && (
                            <Box sx={{ mt: 2 }}>
                              <Typography variant="caption" color="text.secondary">
                                Opciones de respuesta:
                              </Typography>
                              {pregunta.opciones.map((opcion, opIndex) => (
                                <Box key={opIndex} sx={{ ml: 2, mt: 0.5 }}>
                                  <Typography variant="caption">
                                    {opIndex + 1}. {opcion.texto_opcion} ({opcion.puntos} pts)
                                  </Typography>
                                </Box>
                              ))}
                            </Box>
                          )}
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              </Box>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default GeneradorPreguntasIA;