// frontend/src/pages/EntrevistaPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/axiosConfig';

// Importaciones de MUI
import {
  Box,
  Container,
  Typography,
  Paper,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  LinearProgress,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Chip,
  Divider
} from '@mui/material';

// Iconos
import QuizIcon from '@mui/icons-material/Quiz';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

function EntrevistaPage() {
  const { enlaceUnico } = useParams();
  const [entrevista, setEntrevista] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [respuestas, setRespuestas] = useState({});
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    const cargarEntrevista = async () => {
      try {
        const response = await api.get(`/entrevistas/${enlaceUnico}`);
        setEntrevista(response.data);
        // Inicializa el estado para guardar la opción seleccionada para cada pregunta
        const respuestasIniciales = {};
        response.data.preguntas.forEach(p => {
          respuestasIniciales[p.id] = null; // null significa que no se ha seleccionado nada
        });
        setRespuestas(respuestasIniciales);
      } catch (err) {
        setError(err.response?.data?.mensaje || 'No se pudo cargar el test.');
      } finally {
        setLoading(false);
      }
    };
    if (enlaceUnico) cargarEntrevista();
  }, [enlaceUnico]);

  // Guarda el ID de la opción seleccionada para una pregunta específica
  const handleRespuestaChange = (preguntaId, opcionId) => {
    setRespuestas({ ...respuestas, [preguntaId]: opcionId });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setEnviando(true);
    try {
      // El backend ahora se llama 'guardarRespuestasYCalificar'
      await api.post(`/entrevistas/${enlaceUnico}/respuestas`, { respuestas });
      setEnviado(true);
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No se pudieron enviar las respuestas.');
    } finally {
      setEnviando(false);
    }
  };

  // Calcular progreso
  const totalPreguntas = entrevista?.preguntas?.length || 0;
  const preguntasRespondidas = Object.values(respuestas).filter(r => r !== null).length;
  const progreso = totalPreguntas > 0 ? (preguntasRespondidas / totalPreguntas) * 100 : 0;

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f8f9fa'
        }}
      >
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            textAlign: 'center', 
            borderRadius: '8px',
            border: '1px solid #e9ecef',
            backgroundColor: '#ffffff'
          }}
        >
          <CircularProgress size={40} sx={{ mb: 2, color: '#2c5aa0' }} />
          <Typography variant="h6" sx={{ color: '#495057', fontSize: '16px' }}>
            Cargando test...
          </Typography>
        </Paper>
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert 
          severity="error" 
          sx={{ 
            borderRadius: '8px',
            backgroundColor: '#f8d7da',
            border: '1px solid #f5c6cb',
            color: '#721c24'
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '16px' }}>Error</Typography>
          {error}
        </Alert>
      </Container>
    );
  }

  if (enviado) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f8f9fa'
        }}
      >
        <Paper 
          elevation={0} 
          sx={{ 
            p: 6, 
            textAlign: 'center', 
            borderRadius: '8px', 
            maxWidth: 500,
            border: '1px solid #e9ecef',
            backgroundColor: '#ffffff'
          }}
        >
          <CheckCircleIcon sx={{ fontSize: 60, color: '#28a745', mb: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 2, color: '#212529', fontSize: '24px' }}>
            ¡Gracias!
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: '#6c757d', fontSize: '16px' }}>
            Has completado el test exitosamente. Tus respuestas han sido enviadas y procesadas.
          </Typography>
          <Chip 
            label="Test Completado" 
            sx={{ 
              fontSize: '14px', 
              py: 2, 
              px: 1,
              backgroundColor: '#d4edda',
              color: '#155724',
              border: '1px solid #c3e6cb'
            }}
          />
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        py: 4
      }}
    >
      <Container maxWidth="md">
        {/* Header */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            mb: 4, 
            borderRadius: '8px',
            border: '1px solid #e9ecef',
            backgroundColor: '#ffffff'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <QuizIcon sx={{ fontSize: 32, color: '#2c5aa0', mr: 2 }} />
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 600, color: '#212529', fontSize: '24px' }}>
                {entrevista.titulo}
              </Typography>
              <Typography variant="body1" sx={{ color: '#6c757d', fontSize: '16px' }}>
                Test Psicométrico
              </Typography>
            </Box>
          </Box>
          
          <Divider sx={{ my: 2, borderColor: '#e9ecef' }} />
          
          <Typography variant="body1" sx={{ mb: 3, color: '#495057', fontSize: '16px' }}>
            Por favor, selecciona la opción que mejor te describa en cada caso. 
            Responde con honestidad para obtener resultados más precisos.
          </Typography>

          {/* Barra de progreso */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ color: '#6c757d', fontSize: '14px' }}>
                Progreso del test
              </Typography>
              <Typography variant="body2" sx={{ color: '#6c757d', fontSize: '14px' }}>
                {preguntasRespondidas} de {totalPreguntas} preguntas
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={progreso} 
              sx={{ 
                height: 6, 
                borderRadius: '3px',
                backgroundColor: '#e9ecef',
                '& .MuiLinearProgress-bar': {
                  borderRadius: '3px',
                  backgroundColor: '#28a745'
                }
              }} 
            />
          </Box>
        </Paper>

        {/* Formulario */}
        <Box component="form" onSubmit={handleSubmit}>
          {entrevista.preguntas.map((pregunta, index) => (
            <Card 
              key={pregunta?.id} 
              elevation={0} 
              sx={{ 
                mb: 3, 
                borderRadius: '8px',
                border: '1px solid #e9ecef',
                backgroundColor: '#ffffff',
                transition: 'all 0.2s ease',
                '&:hover': {
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  transform: 'translateY(-1px)'
                }
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                  <Chip 
                    label={index + 1} 
                    sx={{ 
                      mr: 2, 
                      minWidth: 32, 
                      fontWeight: 600,
                      backgroundColor: '#2c5aa0',
                      color: '#ffffff',
                      fontSize: '14px'
                    }}
                  />
                  <Typography variant="h6" sx={{ fontWeight: 500, lineHeight: 1.4, color: '#212529', fontSize: '18px' }}>
                    {pregunta.texto}
                  </Typography>
                </Box>

                <RadioGroup
                  name={`pregunta-${pregunta?.id}`}
                  value={respuestas[pregunta?.id] || ''}
                  onChange={(e) => handleRespuestaChange(pregunta?.id, parseInt(e.target.value))}
                >
                  {pregunta.opciones.map(opcion => (
                    <FormControlLabel
                      key={opcion?.id}
                      value={opcion?.id}
                      control={<Radio sx={{ color: '#6c757d', '&.Mui-checked': { color: '#2c5aa0' } }} />}
                      label={opcion.texto_opcion}
                      sx={{
                        mb: 1,
                        ml: 0,
                        '& .MuiFormControlLabel-label': {
                          fontSize: '16px',
                          lineHeight: 1.5,
                          color: '#495057'
                        },
                        '&:hover': {
                          backgroundColor: 'rgba(44, 90, 160, 0.04)',
                          borderRadius: '4px'
                        }
                      }}
                    />
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          ))}

          {/* Botón de envío */}
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              borderRadius: '8px', 
              textAlign: 'center',
              border: '1px solid #e9ecef',
              backgroundColor: '#ffffff'
            }}
          >
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={enviando || preguntasRespondidas < totalPreguntas}
              startIcon={enviando ? <CircularProgress size={16} sx={{ color: '#ffffff' }} /> : <SendIcon />}
              sx={{
                py: 1.5,
                px: 4,
                borderRadius: '6px',
                textTransform: 'none',
                fontSize: '16px',
                fontWeight: 600,
                backgroundColor: '#2c5aa0',
                color: '#ffffff',
                boxShadow: '0 2px 4px rgba(44, 90, 160, 0.2)',
                '&:hover': {
                  backgroundColor: '#1e3d72',
                  boxShadow: '0 4px 8px rgba(44, 90, 160, 0.3)',
                  transform: 'translateY(-1px)',
                },
                '&:disabled': {
                  backgroundColor: '#6c757d',
                  color: '#ffffff',
                  boxShadow: 'none',
                  transform: 'none',
                },
                transition: 'all 0.2s ease',
              }}
            >
              {enviando ? 'Enviando...' : 'Enviar Test'}
            </Button>
            
            {preguntasRespondidas < totalPreguntas && (
              <Typography variant="body2" sx={{ mt: 2, color: '#6c757d', fontSize: '14px' }}>
                Por favor, responde todas las preguntas antes de enviar
              </Typography>
            )}
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}

export default EntrevistaPage;