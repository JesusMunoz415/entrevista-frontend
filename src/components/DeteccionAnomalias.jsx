import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
  Divider,
  Paper
} from '@mui/material';
import {
  Warning as WarningIcon,
  Error as ErrorIcon,
  CheckCircle as CheckCircleIcon,
  ExpandMore as ExpandMoreIcon,
  Security as SecurityIcon,
  Analytics as AnalyticsIcon,
  TrendingUp as TrendingUpIcon,
  Flag as FlagIcon
} from '@mui/icons-material';
import api from '../utils/axiosConfig';
import toast from 'react-hot-toast';

const DeteccionAnomalias = ({ entrevistaId, candidatoInfo }) => {
  const [anomalias, setAnomalias] = useState(null);
  const [loading, setLoading] = useState(false);
  const [estadisticas, setEstadisticas] = useState(null);

  const detectarAnomalias = async () => {
    if (!entrevistaId) {
      toast.error('ID de entrevista requerido');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post(`/patrones/${entrevistaId}/anomalias`);
      setAnomalias(response.data);
      
      // Calcular estadísticas de anomalías
      calcularEstadisticasAnomalias(response.data);
      
      toast.success('Detección de anomalías completada');
    } catch (error) {
      console.error('Error al detectar anomalías:', error);
      toast.error('Error al detectar anomalías');
    } finally {
      setLoading(false);
    }
  };

  const calcularEstadisticasAnomalias = (data) => {
    if (!data || !data.anomalias) return;

    const anomaliasArray = Array.isArray(data.anomalias) ? data.anomalias : [];
    const totalAnomalias = anomaliasArray.length;
    
    const severidades = anomaliasArray.reduce((acc, anomalia) => {
      const sev = anomalia.severidad || 'Baja';
      acc[sev] = (acc[sev] || 0) + 1;
      return acc;
    }, {});

    const categorias = anomaliasArray.reduce((acc, anomalia) => {
      const cat = anomalia.categoria || 'General';
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {});

    const nivelRiesgo = calcularNivelRiesgo(anomaliasArray);

    setEstadisticas({
      totalAnomalias,
      severidades,
      categorias,
      nivelRiesgo
    });
  };

  const calcularNivelRiesgo = (anomalias) => {
    const puntajes = {
      'Alta': 3,
      'Media': 2,
      'Baja': 1
    };

    const puntajeTotal = anomalias.reduce((sum, anomalia) => {
      return sum + (puntajes[anomalia.severidad] || 1);
    }, 0);

    if (puntajeTotal >= 10) return 'Alto';
    if (puntajeTotal >= 5) return 'Medio';
    return 'Bajo';
  };

  const getSeveridadColor = (severidad) => {
    switch (severidad) {
      case 'Alta': return 'error';
      case 'Media': return 'warning';
      case 'Baja': return 'info';
      default: return 'default';
    }
  };

  const getSeveridadIcon = (severidad) => {
    switch (severidad) {
      case 'Alta': return <ErrorIcon />;
      case 'Media': return <WarningIcon />;
      case 'Baja': return <FlagIcon />;
      default: return <CheckCircleIcon />;
    }
  };

  const getRiesgoColor = (nivel) => {
    switch (nivel) {
      case 'Alto': return 'error';
      case 'Medio': return 'warning';
      case 'Bajo': return 'success';
      default: return 'info';
    }
  };

  const renderAnomaliaCard = (anomalia, index) => (
    <Card key={index} sx={{ mb: 2, border: `2px solid`, borderColor: `${getSeveridadColor(anomalia.severidad)}.main` }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {getSeveridadIcon(anomalia.severidad)}
          <Typography variant="h6" sx={{ ml: 1, flexGrow: 1 }}>
            {anomalia.tipo || `Anomalía ${index + 1}`}
          </Typography>
          <Chip 
            label={anomalia.severidad || 'Baja'}
            color={getSeveridadColor(anomalia.severidad)}
            size="small"
          />
        </Box>
        
        <Typography variant="body2" sx={{ mb: 2 }}>
          {anomalia.descripcion}
        </Typography>
        
        {anomalia.categoria && (
          <Chip 
            label={anomalia.categoria}
            variant="outlined"
            size="small"
            sx={{ mr: 1, mb: 1 }}
          />
        )}
        
        {anomalia.confianza && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" display="block">
              Nivel de confianza: {anomalia.confianza}%
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={anomalia.confianza} 
              sx={{ mt: 0.5, height: 6, borderRadius: 3 }}
            />
          </Box>
        )}
        
        {anomalia.recomendacion && (
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Recomendación:</strong> {anomalia.recomendacion}
            </Typography>
          </Alert>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Detección de Anomalías
      </Typography>

      {candidatoInfo && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Información del Candidato
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2">
                  <strong>Nombre:</strong> {candidatoInfo.nombre}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2">
                  <strong>Email:</strong> {candidatoInfo.email}
                </Typography>
              </Grid>
              {candidatoInfo.puesto && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>Puesto:</strong> {candidatoInfo.puesto}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
      )}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Análisis de Anomalías
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Este análisis compara las respuestas del candidato con patrones históricos para identificar comportamientos inusuales o inconsistencias.
          </Typography>
          
          <Button
            variant="contained"
            onClick={detectarAnomalias}
            disabled={loading || !entrevistaId}
            startIcon={loading ? <CircularProgress size={20} /> : <SecurityIcon />}
            size="large"
          >
            {loading ? 'Detectando anomalías...' : 'Detectar Anomalías'}
          </Button>
        </CardContent>
      </Card>

      {/* Estadísticas de Anomalías */}
      {estadisticas && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Resumen del Análisis
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.light', color: 'white' }}>
                  <Typography variant="h4">
                    {estadisticas.totalAnomalias}
                  </Typography>
                  <Typography variant="caption">
                    Anomalías Detectadas
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ 
                  p: 2, 
                  textAlign: 'center', 
                  bgcolor: `${getRiesgoColor(estadisticas.nivelRiesgo)}.light`,
                  color: 'white'
                }}>
                  <Typography variant="h4">
                    {estadisticas.nivelRiesgo}
                  </Typography>
                  <Typography variant="caption">
                    Nivel de Riesgo
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Distribución por Severidad:
                </Typography>
                {Object.entries(estadisticas.severidades).map(([severidad, cantidad]) => (
                  <Box key={severidad} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Chip 
                      label={`${severidad}: ${cantidad}`}
                      color={getSeveridadColor(severidad)}
                      size="small"
                      sx={{ minWidth: 100 }}
                    />
                    <Box sx={{ flexGrow: 1, ml: 2 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={(cantidad / estadisticas.totalAnomalias) * 100} 
                        color={getSeveridadColor(severidad)}
                        sx={{ height: 6, borderRadius: 3 }}
                      />
                    </Box>
                  </Box>
                ))}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Resultados de Anomalías */}
      {anomalias && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Anomalías Detectadas
            </Typography>
            
            {anomalias.anomalias && anomalias.anomalias.length > 0 ? (
              <Box>
                {anomalias.anomalias.map((anomalia, index) => 
                  renderAnomaliaCard(anomalia, index)
                )}
                
                {/* Análisis General */}
                {anomalias.analisisGeneral && (
                  <Accordion sx={{ mt: 2 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="subtitle1">
                        Análisis General
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2">
                        {anomalias.analisisGeneral}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                )}
                
                {/* Recomendaciones Generales */}
                {anomalias.recomendaciones && (
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="subtitle1">
                        Recomendaciones Generales
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {Array.isArray(anomalias.recomendaciones) ? (
                        <List>
                          {anomalias.recomendaciones.map((rec, index) => (
                            <ListItem key={index}>
                              <ListItemIcon>
                                <CheckCircleIcon color="success" />
                              </ListItemIcon>
                              <ListItemText primary={rec} />
                            </ListItem>
                          ))}
                        </List>
                      ) : (
                        <Typography variant="body2">
                          {anomalias.recomendaciones}
                        </Typography>
                      )}
                    </AccordionDetails>
                  </Accordion>
                )}
              </Box>
            ) : (
              <Alert severity="success">
                <Typography variant="body2">
                  ¡Excelente! No se detectaron anomalías significativas en las respuestas del candidato.
                  Las respuestas siguen patrones normales y consistentes.
                </Typography>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {!anomalias && !loading && (
        <Alert severity="info" sx={{ textAlign: 'center' }}>
          Haz clic en "Detectar Anomalías" para analizar las respuestas del candidato y identificar patrones inusuales.
        </Alert>
      )}
    </Box>
  );
};

export default DeteccionAnomalias;