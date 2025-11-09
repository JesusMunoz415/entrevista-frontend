import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Alert,
  CircularProgress,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Tooltip,
  Tabs,
  Tab
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Visibility as VisibilityIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axiosConfig';
import { toast } from 'react-hot-toast';

const EvaluacionManualPage = () => {
  const [entrevistasPendientes, setEntrevistasPendientes] = useState([]);
  const [candidatosEvaluados, setCandidatosEvaluados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const [pendientesRes, evaluadosRes] = await Promise.all([
        api.get(
          '/evaluacion/pendientes',
          { headers: { Authorization: `Bearer ${token}` } }
        ),
        api.get(
          '/evaluacion/evaluados',
          { headers: { Authorization: `Bearer ${token}` } }
        )
      ]);

      setEntrevistasPendientes(pendientesRes.data.pendientes || []);
      setCandidatosEvaluados(evaluadosRes.data.evaluados || []);
      setError(null);
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setError('Error al cargar los datos');
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const cargarEntrevistasPendientes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await api.get(
        '/evaluacion/pendientes',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setEntrevistasPendientes(response.data.pendientes || []);
      setError(null);
    } catch (err) {
      console.error('Error al cargar entrevistas pendientes:', err);
      setError('Error al cargar las entrevistas pendientes');
      toast.error('Error al cargar las entrevistas pendientes');
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return 'No disponible';
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getChipColor = (ipg) => {
    if (ipg >= 80) return 'success';
    if (ipg >= 60) return 'warning';
    return 'error';
  };

  const getEstadoEvaluacion = (estado) => {
    if (estado === 'aprobado') {
      return { label: 'Aprobado', color: 'success', icon: <CheckCircleIcon /> };
    } else if (estado === 'rechazado') {
      return { label: 'Rechazado', color: 'error', icon: <CancelIcon /> };
    } else {
      return { label: 'Pendiente', color: 'warning', icon: <ScheduleIcon /> };
    }
  };

  const handleEvaluarEntrevista = (entrevistaId) => {
    navigate(`/dashboard/evaluacion/${entrevistaId}`);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/dashboard')}
          sx={{ mb: 2 }}
        >
          Volver al Home
        </Button>
        
        <Typography variant="h4" component="h1" gutterBottom>
          <AssessmentIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
          Evaluación de Candidatos
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Revisa los informes de IA y evalúa manualmente a los candidatos
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Estadísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <ScheduleIcon color="warning" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4" component="div">
                    {entrevistasPendientes.length}
                  </Typography>
                  <Typography color="text.secondary">
                    Pendientes
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <CheckCircleIcon color="success" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4" component="div">
                    {candidatosEvaluados.filter(c => c?.evaluacion_manual_estado === 'aprobado').length}
                  </Typography>
                  <Typography color="text.secondary">
                    Aprobados
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <CancelIcon color="error" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4" component="div">
                    {candidatosEvaluados.filter(c => c?.evaluacion_manual_estado === 'rechazado').length}
                  </Typography>
                  <Typography color="text.secondary">
                    Rechazados
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <AssessmentIcon color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4" component="div">
                    {candidatosEvaluados.length}
                  </Typography>
                  <Typography color="text.secondary">
                    Total Evaluados
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs para separar pendientes y evaluados */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="evaluacion tabs">
            <Tab 
              label={`Pendientes (${entrevistasPendientes.length})`} 
              icon={<ScheduleIcon />}
              iconPosition="start"
            />
            <Tab 
              label={`Evaluados (${candidatosEvaluados.length})`} 
              icon={<CheckCircleIcon />}
              iconPosition="start"
            />
          </Tabs>
        </Box>

        <CardContent>
          {/* Tab Panel - Pendientes */}
          {tabValue === 0 && (
            <Box>
              {entrevistasPendientes.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                  <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    ¡Excelente trabajo!
                  </Typography>
                  <Typography color="text.secondary">
                    No hay entrevistas pendientes de evaluación manual.
                  </Typography>
                </Paper>
              ) : (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Entrevistas Pendientes de Evaluación
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <List>
                    {entrevistasPendientes.map((entrevista, index) => (
                      <React.Fragment key={entrevista?.id || index}>
                        <ListItem
                          sx={{
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 1,
                            mb: 2,
                            '&:hover': {
                              backgroundColor: 'action.hover'
                            }
                          }}
                        >
                          <ListItemText
                            primary={
                              <Box display="flex" alignItems="center" gap={2}>
                                <PersonIcon color="primary" />
                                <Typography variant="h6">
                                  {entrevista?.candidato_nombre || 'Nombre no disponible'}
                                </Typography>
                                <Chip
                                  label={`IPG: ${entrevista?.ipg_final || 0}%`}
                                  color={getChipColor(entrevista?.ipg_final || 0)}
                                  size="small"
                                />
                                {entrevista.tiene_informe_ia && (
                                  <Chip
                                    label="Informe IA Disponible"
                                    color="info"
                                    size="small"
                                    variant="outlined"
                                  />
                                )}
                              </Box>
                            }
                            secondary={
                              <Box mt={1} component="div">
                                <Box component="div" sx={{ fontSize: '0.875rem', color: 'text.secondary', mb: 0.5 }}>
                                  <strong>Email:</strong> {entrevista?.candidato_email || 'Email no disponible'}
                                </Box>
                                <Box component="div" sx={{ fontSize: '0.875rem', color: 'text.secondary', mb: 0.5 }}>
                                  <strong>Plantilla:</strong> {entrevista?.plantilla_titulo || 'Plantilla no disponible'}
                                </Box>
                                <Box component="div" sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                                  <strong>Completada:</strong> {entrevista?.fecha_completada ? formatearFecha(entrevista.fecha_completada) : 'Fecha no disponible'}
                                </Box>
                              </Box>
                            }
                            secondaryTypographyProps={{ component: 'div' }}
                          />
                          <ListItemSecondaryAction>
                            <Tooltip title="Evaluar candidato">
                              <Button
                                variant="contained"
                                color="primary"
                                startIcon={<VisibilityIcon />}
                                onClick={() => handleEvaluarEntrevista(entrevista?.id)}
                              >
                                Evaluar
                              </Button>
                            </Tooltip>
                          </ListItemSecondaryAction>
                        </ListItem>
                        {index < entrevistasPendientes.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                </Box>
              )}
            </Box>
          )}

          {/* Tab Panel - Evaluados */}
          {tabValue === 1 && (
            <Box>
              {candidatosEvaluados.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                  <AssessmentIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Sin evaluaciones completadas
                  </Typography>
                  <Typography color="text.secondary">
                    Aún no has evaluado ningún candidato.
                  </Typography>
                </Paper>
              ) : (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Candidatos Evaluados
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <List>
                    {candidatosEvaluados.map((candidato, index) => {
                      const estadoEvaluacion = getEstadoEvaluacion(candidato?.evaluacion_manual_estado);
                      return (
                        <React.Fragment key={candidato?.id || index}>
                          <ListItem
                            sx={{
                              border: '1px solid',
                              borderColor: 'divider',
                              borderRadius: 1,
                              mb: 2,
                              '&:hover': {
                                backgroundColor: 'action.hover'
                              }
                            }}
                          >
                            <ListItemText
                              primary={
                                <Box display="flex" alignItems="center" gap={2}>
                                  <PersonIcon color="primary" />
                                  <Typography variant="h6">
                                    {candidato?.candidato_nombre || 'Nombre no disponible'}
                                  </Typography>
                                  <Chip
                                    label={estadoEvaluacion.label}
                                    color={estadoEvaluacion.color}
                                    size="small"
                                    icon={estadoEvaluacion.icon}
                                  />
                                  <Chip
                                    label={`IPG: ${candidato?.ipg_final || 0}%`}
                                    color={getChipColor(candidato?.ipg_final || 0)}
                                    size="small"
                                  />
                                </Box>
                              }
                              secondary={
                                <Box mt={1} component="div">
                                  <Box component="div" sx={{ fontSize: '0.875rem', color: 'text.secondary', mb: 0.5 }}>
                                    <strong>Email:</strong> {candidato?.candidato_email || 'Email no disponible'}
                                  </Box>
                                  <Box component="div" sx={{ fontSize: '0.875rem', color: 'text.secondary', mb: 0.5 }}>
                                    <strong>Plantilla:</strong> {candidato?.plantilla_titulo || 'Plantilla no disponible'}
                                  </Box>
                                  <Box component="div" sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                                    <strong>Completada:</strong> {candidato?.fecha_completada ? formatearFecha(candidato.fecha_completada) : 'Fecha no disponible'}
                                  </Box>
                                  <Box component="div" sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                                    <strong>Evaluada:</strong> {candidato?.evaluacion_manual_fecha ? formatearFecha(candidato.evaluacion_manual_fecha) : 'Fecha no disponible'}
                                  </Box>
                                  {candidato?.evaluacion_manual_comentarios && (
                                    <Box mt={1} p={1} sx={{ backgroundColor: 'grey.50', borderRadius: 1 }}>
                                      <Box component="div" sx={{ fontSize: '0.75rem', color: 'text.secondary', fontWeight: 'bold', mb: 0.5 }}>
                                        Comentarios:
                                      </Box>
                                      <Box component="div" sx={{ fontSize: '0.875rem' }}>
                                        {candidato?.evaluacion_manual_comentarios}
                                      </Box>
                                    </Box>
                                  )}
                                </Box>
                              }
                              secondaryTypographyProps={{ component: 'div' }}
                            />
                            <ListItemSecondaryAction>
                              <Tooltip title="Ver detalles">
                                <Button
                                  variant="outlined"
                                  color="primary"
                                  startIcon={<VisibilityIcon />}
                                  onClick={() => handleEvaluarEntrevista(candidato?.id)}
                                >
                                  Ver Detalles
                                </Button>
                              </Tooltip>
                            </ListItemSecondaryAction>
                          </ListItem>
                          {index < candidatosEvaluados.length - 1 && <Divider />}
                        </React.Fragment>
                      );
                    })}
                  </List>
                </Box>
              )}
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default EvaluacionManualPage;