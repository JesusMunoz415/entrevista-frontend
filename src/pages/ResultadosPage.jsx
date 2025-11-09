import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/axiosConfig';
import toast from 'react-hot-toast';
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  CardActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Grid,
  Paper,
  CircularProgress,
  Alert,
  Divider,
  Tab,
  Tabs,
  Avatar,
  LinearProgress
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Psychology as PsychologyIcon,
  Recommend as RecommendIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  Download as DownloadIcon,
  Analytics as AnalyticsIcon,
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Assessment as AssessmentIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
} from '@mui/icons-material';

// ✅ 1. Importa PDFDownloadLink y tu componente PDF
import { PDFDownloadLink } from '@react-pdf/renderer';
import ReportePDF from '../components/ReportePDF'; // Asegúrate de que la ruta sea correcta

// Componente TabPanel para las pestañas
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function ResultadosPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resultados, setResultados] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analisisIA, setAnalisisIA] = useState(null);
  const [recomendaciones, setRecomendaciones] = useState(null);
  const [patrones, setPatrones] = useState(null);
  const [anomalias, setAnomalias] = useState(null);
  const [loadingIA, setLoadingIA] = useState(false);
  const [loadingRecomendaciones, setLoadingRecomendaciones] = useState(false);
  const [loadingPatrones, setLoadingPatrones] = useState(false);
  const [loadingAnomalias, setLoadingAnomalias] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  // --- Lógica de Carga y Análisis ---
  const cargarResultados = async () => {
     try {
       setLoading(true);
       const response = await api.get(`/resultados/${id}`);
       setResultados(response.data);
     } catch (error) {
       console.error("Error al cargar resultados", error);
       toast.error("No se pudieron cargar los resultados.");
     } finally {
       setLoading(false);
     }
   };

  useEffect(() => {
    cargarResultados();
  }, [id]);

  const realizarAnalisisIA = async () => {
    try {
      setLoadingIA(true);
      const response = await api.post(`/resultados/${id}/analisis-ia`);
      setAnalisisIA(response.data.analisis);
      toast.success("Análisis de IA completado");
    } catch (error) {
      console.error("Error en análisis de IA", error);
      toast.error("Error al realizar análisis de IA");
    } finally {
      setLoadingIA(false);
    }
  };

  const obtenerRecomendaciones = async () => {
    try {
      setLoadingRecomendaciones(true);
      const response = await api.post(`/resultados/${id}/recomendaciones`);
      setRecomendaciones(response.data.recomendaciones);
      toast.success("Recomendaciones generadas");
    } catch (error) {
      console.error("Error al obtener recomendaciones", error);
      toast.error("Error al generar recomendaciones");
    } finally {
      setLoadingRecomendaciones(false);
    }
  };

  const detectarPatrones = async () => {
    try {
      setLoadingPatrones(true);
      const response = await api.post(`/resultados/${id}/patrones`);
      setPatrones(response.data.patrones);
      toast.success("Patrones detectados");
    } catch (error) {
      console.error("Error al detectar patrones", error);
      toast.error("Error al detectar patrones");
    } finally {
      setLoadingPatrones(false);
    }
  };

  const detectarAnomalias = async () => {
    try {
      setLoadingAnomalias(true);
      const response = await api.post(`/resultados/${id}/anomalias`);
      setAnomalias(response.data.anomalias);
      toast.success("Anomalías detectadas");
    } catch (error) {
      console.error("Error al detectar anomalías", error);
      toast.error("Error al detectar anomalías");
    } finally {
      setLoadingAnomalias(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!resultados) {
    return (
      <Box p={3}>
        <Alert severity="error">No se encontraron resultados para esta evaluación.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/dashboard')}
        >
          Volver al Home
        </Button>
        
        <PDFDownloadLink
          document={<ReportePDF resultados={resultados} />}
          fileName={`reporte-${resultados.candidato?.nombre || 'candidato'}.pdf`}
        >
          {({ blob, url, loading, error }) => (
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              disabled={loading}
            >
              {loading ? 'Generando PDF...' : 'Descargar PDF'}
            </Button>
          )}
        </PDFDownloadLink>
      </Box>

      {/* Información básica del candidato */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Resultados de Evaluación
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">Información del Candidato</Typography>
            <Typography><strong>Nombre:</strong> {resultados.candidato?.nombre}</Typography>
            <Typography><strong>Email:</strong> {resultados.candidato?.email}</Typography>
            <Typography><strong>Plantilla:</strong> {resultados.plantilla?.nombre}</Typography>
            <Typography><strong>Fecha de Completado:</strong> {new Date(resultados.fechaCompletado).toLocaleDateString()}</Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h6">Índice de Personalidad Global (IPG)</Typography>
            <Typography variant="h3" color="primary">
              {resultados?.ipg || 0}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {(resultados?.ipg || 0) >= 80 ? 'Excelente' :
                  (resultados?.ipg || 0) >= 60 ? 'Bueno' : 'Necesita Mejora'}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Desglose por módulos */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Desglose por Módulos
        </Typography>
        <Grid container spacing={2}>
          {resultados.modulos?.map((modulo, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{modulo.nombre}</Typography>
                  <Typography variant="h4" color="primary">
                    {modulo.puntuacion}%
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {modulo.descripcion}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Análisis con IA */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Análisis con IA
        </Typography>
        
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Análisis" />
          <Tab label="Recomendaciones" />
          <Tab label="Patrones" />
          <Tab label="Anomalías" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ mb: 2 }}>
            <Button
              variant="contained"
              startIcon={<PsychologyIcon />}
              onClick={realizarAnalisisIA}
              disabled={loadingIA}
            >
              {loadingIA ? 'Analizando...' : 'Realizar Análisis de IA'}
            </Button>
          </Box>
          {analisisIA && (
            <Alert severity="info">
              <Typography variant="body1">{analisisIA}</Typography>
            </Alert>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ mb: 2 }}>
            <Button
              variant="contained"
              startIcon={<RecommendIcon />}
              onClick={obtenerRecomendaciones}
              disabled={loadingRecomendaciones}
            >
              {loadingRecomendaciones ? 'Generando...' : 'Generar Recomendaciones'}
            </Button>
          </Box>
          {recomendaciones && (
            <Alert severity="success">
              <Typography variant="body1">{recomendaciones}</Typography>
            </Alert>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Box sx={{ mb: 2 }}>
            <Button
              variant="contained"
              startIcon={<TrendingUpIcon />}
              onClick={detectarPatrones}
              disabled={loadingPatrones}
            >
              {loadingPatrones ? 'Detectando...' : 'Detectar Patrones'}
            </Button>
          </Box>
          {patrones && (
            <Alert severity="warning">
              <Typography variant="body1">{patrones}</Typography>
            </Alert>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Box sx={{ mb: 2 }}>
            <Button
              variant="contained"
              startIcon={<WarningIcon />}
              onClick={detectarAnomalias}
              disabled={loadingAnomalias}
            >
              {loadingAnomalias ? 'Detectando...' : 'Detectar Anomalías'}
            </Button>
          </Box>
          {anomalias && (
            <Alert severity="error">
              <Typography variant="body1">{anomalias}</Typography>
            </Alert>
          )}
        </TabPanel>
      </Paper>

      {/* Respuestas individuales */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Respuestas Individuales
        </Typography>
        {resultados.respuestas?.map((respuesta, index) => (
          <Accordion key={index}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">
                Pregunta {index + 1}: {respuesta.pregunta}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1" paragraph>
                <strong>Respuesta:</strong> {respuesta.respuesta}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                <strong>Puntuación:</strong> {respuesta.puntuacion}/10
              </Typography>
              {respuesta.feedback && (
                <Typography variant="body2" color="primary">
                  <strong>Feedback:</strong> {respuesta.feedback}
                </Typography>
              )}
            </AccordionDetails>
          </Accordion>
        ))}
      </Paper>
    </Box>
  );
}

export default ResultadosPage;