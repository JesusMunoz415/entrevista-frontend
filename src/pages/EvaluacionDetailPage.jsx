// frontend/src/pages/EvaluacionDetailPage.jsx

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
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Assessment as AssessmentIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Psychology as PsychologyIcon,
  ExpandMore as ExpandMoreIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Warning as WarningIcon,
  Lightbulb as LightbulbIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
// import axios from 'axios'; // 🗙 Eliminado
import api from '../api/axiosConfig'; // ✅ Añadido - (Ajusta esta ruta si es necesario)
import { toast } from 'react-hot-toast';

const EvaluacionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [entrevista, setEntrevista] = useState(null);
  const [informeIA, setInformeIA] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingInforme, setLoadingInforme] = useState(false);
  const [loadingEvaluacion, setLoadingEvaluacion] = useState(false);
  const [error, setError] = useState(null);
  
  // Estados para la evaluación manual
  const [decision, setDecision] = useState('');
  const [comentarios, setComentarios] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    cargarDatosEntrevista();
  }, [id]);

  const cargarDatosEntrevista = async () => {
    try {
      setLoading(true);
      
      // Validar que el ID existe y no es undefined
      if (!id || id === 'undefined') {
        setError('ID de entrevista no válido');
        toast.error('ID de entrevista no válido');
        return;
      }
      
      const token = localStorage.getItem('token');
      
      // ✅ CORREGIDO: Se usa `api.get` y se elimina el prefijo de la URL
      const response = await api.get(
        `/evaluacion/${id}/estado`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setEntrevista(response.data);
      
      // Si ya tiene informe de IA, parsearlo
      if (response.data.informe_ia) {
        try {
          const informe = typeof response.data.informe_ia === 'string' 
            ? JSON.parse(response.data.informe_ia) 
            : response.data.informe_ia;
          setInformeIA(informe);
        } catch (parseError) {
          console.error('Error al parsear informe IA:', parseError);
        }
      }
      
      setError(null);
    } catch (err) {
      console.error('Error al cargar datos de entrevista:', err);
      setError('Error al cargar los datos de la entrevista');
      toast.error('Error al cargar los datos de la entrevista');
    } finally {
      setLoading(false);
    }
  };

  const generarInformeIA = async () => {
    try {
      setLoadingInforme(true);
      
      // Validar que el ID existe y no es undefined
      if (!id || id === 'undefined') {
        toast.error('ID de entrevista no válido');
        return;
      }
      
      const token = localStorage.getItem('token');
      
      // ✅ CORREGIDO: Se usa `api.post` y se elimina el prefijo de la URL
      const response = await api.post(
        `/evaluacion/${id}/informe-critico`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setInformeIA(response.data.informe);
      toast.success('Informe crítico generado exitosamente');
    } catch (err) {
      console.error('Error al generar informe IA:', err);
      toast.error('Error al generar el informe crítico');
    } finally {
      setLoadingInforme(false);
    }
  };

  const handleSubmitEvaluacion = async () => {
    if (!decision || !comentarios.trim()) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    if (comentarios.trim().length < 10) {
      toast.error('Los comentarios deben tener al menos 10 caracteres');
      return;
    }

    try {
      setLoadingEvaluacion(true);
      
      // Validar que el ID existe y no es undefined
      if (!id || id === 'undefined') {
        toast.error('ID de entrevista no válido');
        return;
      }
      
      const token = localStorage.getItem('token');
      
      // ✅ CORREGIDO: Se usa `api.post` y se elimina el prefijo de la URL
      await api.post(
        `/evaluacion/${id}/evaluar`,
        {
          decision,
          comentarios: comentarios.trim()
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success('Evaluación guardada exitosamente');
      setShowConfirmDialog(false);
      
      // Marcar que las estadísticas necesitan actualizarse
      localStorage.setItem('estadisticas_actualizadas', 'false');
      
      navigate('/dashboard/evaluacion');
    } catch (err) {
      console.error('Error al guardar evaluación:', err);
      toast.error('Error al guardar la evaluación');
    } finally {
      setLoadingEvaluacion(false);
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

  const renderInformeIA = () => {
    if (!informeIA) return null;

    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <PsychologyIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Informe de Evaluación de Competencias
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {/* Resumen ejecutivo */}
          {informeIA.resumen_ejecutivo && (
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Resumen Ejecutivo
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1" paragraph>
                  {informeIA.resumen_ejecutivo}
                </Typography>
              </AccordionDetails>
            </Accordion>
          )}

          {/* Fortalezas */}
          {informeIA.fortalezas && informeIA.fortalezas.length > 0 && (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1" fontWeight="bold" color="success.main">
                  <TrendingUpIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Fortalezas Identificadas
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {informeIA.fortalezas.map((fortaleza, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <CheckCircleIcon color="success" />
                      </ListItemIcon>
                      <ListItemText primary={fortaleza} />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          )}

          {/* Debilidades */}
          {informeIA.debilidades && informeIA.debilidades.length > 0 && (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1" fontWeight="bold" color="error.main">
                  <CancelIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Debilidades Identificadas
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {informeIA.debilidades.map((debilidad, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <CancelIcon color="error" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={debilidad}
                        sx={{ 
                          '& .MuiListItemText-primary': { 
                            color: 'error.main',
                            fontWeight: 'medium'
                          } 
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          )}

          {/* Áreas de mejora */}
          {informeIA.areas_mejora && informeIA.areas_mejora.length > 0 && (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1" fontWeight="bold" color="warning.main">
                  <TrendingDownIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Áreas de Mejora
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {informeIA.areas_mejora.map((area, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <WarningIcon color="warning" />
                      </ListItemIcon>
                      <ListItemText primary={area} />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          )}

          {/* Recomendaciones */}
          {informeIA.recomendaciones && informeIA.recomendaciones.length > 0 && (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1" fontWeight="bold" color="info.main">
                  <LightbulbIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Recomendaciones
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {informeIA.recomendaciones.map((recomendacion, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <LightbulbIcon color="info" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={recomendacion}
                        sx={{ 
                          '& .MuiListItemText-primary': { 
                            fontWeight: 'medium'
                          } 
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          )}

          {/* Patrones Detectados */}
          {informeIA.patrones_detectados && informeIA.patrones_detectados.length > 0 && (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1" fontWeight="bold" color="secondary.main">
                  <AssessmentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Patrones Detectados
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {informeIA.patrones_detectados.map((patron, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <AssessmentIcon color="secondary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={patron}
                        sx={{ 
                          '& .MuiListItemText-primary': { 
                            fontWeight: 'medium'
                          } 
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          )}

          {/* Riesgos Potenciales */}
          {informeIA.riesgos_potenciales && informeIA.riesgos_potenciales.length > 0 && (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1" fontWeight="bold" color="error.main">
                  <WarningIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Riesgos Potenciales
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {informeIA.riesgos_potenciales.map((riesgo, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <WarningIcon color="error" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={riesgo}
                        sx={{ 
                          '& .MuiListItemText-primary': { 
                            color: 'error.main',
                            fontWeight: 'medium'
                          } 
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          )}

          {/* Información adicional */}
          <Box mt={2}>
            <Typography variant="caption" color="text.secondary">
              Generado el: {formatearFecha(informeIA.fecha_generacion)}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
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

  if (error || !entrevista) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">
          {error || 'Entrevista no encontrada'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/dashboard/evaluacion')}
          sx={{ mb: 2 }}
        >
          Volver a Evaluaciones
        </Button>
        
        <Typography variant="h4" component="h1" gutterBottom>
          <AssessmentIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
          Evaluación de {entrevista?.candidato?.nombre || 'candidato...'}
        </Typography>
      </Box>

      {/* Información del candidato */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Información del Candidato
              </Typography>
              <Typography><strong>Nombre:</strong> {entrevista?.candidato?.nombre}</Typography>
              <Typography><strong>Email:</strong> {entrevista?.candidato?.email}</Typography>
              <Typography><strong>Plantilla:</strong> {entrevista.plantilla}</Typography>
              <Typography><strong>Completada:</strong> {entrevista?.fecha_completada ? formatearFecha(entrevista.fecha_completada) : 'Fecha no disponible'}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Resultados
              </Typography>
              <Box display="flex" alignItems="center" gap={2}>
                <Chip
                  label={`IPG Final: ${entrevista?.ipg_final || 0}%`}
                  color={getChipColor(entrevista?.ipg_final || 0)}
                  size="large"
                />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Informe de IA */}
      {informeIA ? (
        renderInformeIA()
      ) : (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Informe de Evaluación de Competencias
            </Typography>
            <Typography color="text.secondary" paragraph>
              No se ha generado aún el informe de evaluación de competencias para esta entrevista.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={generarInformeIA}
              disabled={loadingInforme}
              startIcon={loadingInforme ? <CircularProgress size={20} /> : <PsychologyIcon />}
            >
              {loadingInforme ? 'Generando...' : 'Generar Informe de Evaluación'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Evaluación manual */}
          {entrevista?.evaluacion_manual?.estado === 'pendiente' && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Evaluación Manual
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl component="fieldset" fullWidth>
                  <FormLabel component="legend">Decisión Final</FormLabel>
                  <RadioGroup
                    value={decision}
                    onChange={(e) => setDecision(e.target.value)}
                  >
                    <FormControlLabel
                      value="aprobado"
                      control={<Radio />}
                      label={
                        <Box display="flex" alignItems="center">
                          <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                          Aprobar Candidato
                        </Box>
                      }
                    />
                    <FormControlLabel
                      value="rechazado"
                      control={<Radio />}
                      label={
                        <Box display="flex" alignItems="center">
                          <CancelIcon color="error" sx={{ mr: 1 }} />
                          Rechazar Candidato
                        </Box>
                      }
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Comentarios y Justificación"
                  placeholder="Explica tu decisión y proporciona feedback detallado..."
                  value={comentarios}
                  onChange={(e) => setComentarios(e.target.value)}
                  helperText={`${comentarios.length}/500 caracteres (mínimo 10)`}
                  inputProps={{ maxLength: 500 }}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => setShowConfirmDialog(true)}
                  disabled={!decision || !comentarios.trim() || comentarios.trim().length < 10}
                >
                  Finalizar Evaluación
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Evaluación ya completada */}
      {entrevista?.evaluacion_manual?.estado !== 'pendiente' && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Evaluación Completada
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              {entrevista?.evaluacion_manual?.estado === 'aprobado' ? (
                <Chip
                  icon={<CheckCircleIcon />}
                  label="Candidato Aprobado"
                  color="success"
                  size="large"
                />
              ) : (
                <Chip
                  icon={<CancelIcon />}
                  label="Candidato Rechazado"
                  color="error"
                  size="large"
                />
              )}
            </Box>

            <Typography variant="body1" paragraph>
              <strong>Comentarios:</strong>
            </Typography>
            <Paper sx={{ p: 2, backgroundColor: 'grey.50' }}>
              <Typography variant="body2">
                {entrevista?.evaluacion_manual?.comentarios}
              </Typography>
            </Paper>

            <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
              Evaluado el: {formatearFecha(entrevista?.evaluacion_manual?.fecha)}
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Dialog de confirmación */}
      <Dialog open={showConfirmDialog} onClose={() => setShowConfirmDialog(false)}>
        <DialogTitle>Confirmar Evaluación</DialogTitle>
        <DialogContent>
          <Typography paragraph>
            ¿Estás seguro de que deseas finalizar la evaluación con la siguiente decisión?
          </Typography>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            {decision === 'aprobado' ? (
              <Chip icon={<CheckCircleIcon />} label="Aprobar" color="success" />
            ) : (
              <Chip icon={<CancelIcon />} label="Rechazar" color="error" />
            )}
          </Box>
          <Typography variant="body2" color="text.secondary">
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmDialog(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmitEvaluacion}
            variant="contained"
            disabled={loadingEvaluacion}
          >
            {loadingEvaluacion ? 'Guardando...' : 'Confirmar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EvaluacionDetailPage;