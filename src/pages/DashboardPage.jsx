import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/axiosConfig';
import toast from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';
import InvitarCandidato from '../components/InvitarCandidato';
import PlantillaCard from '../components/PlantillaCard';
import EntrevistaCompletadaCard from '../components/EntrevistaCompletadaCard';
import ConfirmDialog from '../components/ConfirmDialog';
import ColorfulAvatar from '../components/ColorfulAvatar';
import userService from '../services/userService';

// Importaciones de MUI
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

// Iconos
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import HomeIcon from '@mui/icons-material/Home';
import LinkIcon from '@mui/icons-material/Link';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonIcon from '@mui/icons-material/Person';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PsychologyIcon from '@mui/icons-material/Psychology';
import SecurityIcon from '@mui/icons-material/Security';

function DashboardPage() {
  // --- 1. DEFINICIÓN DE ESTADOS ---
  const navigate = useNavigate();
  const [entrevistador, setEntrevistador] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [avatarColor, setAvatarColor] = useState('#2c5aa0');
  const [plantillas, setPlantillas] = useState([]);
  const [estadisticas, setEstadisticas] = useState({
    totalPlantillas: 0,
    totalEntrevistas: 0,
    candidatosEvaluados: 0,
    candidatosPendientes: 0,
    candidatosAprobados: 0,
    porcentajeAprobacion: 0,
  });
  const [entrevistasCompletadas, setEntrevistasCompletadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    plantillaId: null,
    plantillaNombre: ''
  });
  const [enlaceGenerado, setEnlaceGenerado] = useState('');

  // --- 2. LÓGICA Y MANEJADORES DE EVENTOS ---

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    toast.success('Sesión cerrada exitosamente');
    navigate('/login');
  }, [navigate]);

  const handleEliminar = useCallback((plantillaId) => {
    console.log('DashboardPage: handleEliminar llamado para plantilla ID:', plantillaId);
    
    // Encontrar la plantilla para obtener su nombre
    const plantilla = plantillas.find(p => p?.id === plantillaId);
    const nombrePlantilla = plantilla ? plantilla.nombre : 'esta plantilla';
    
    // Abrir el diálogo de confirmación personalizado
    setConfirmDialog({
      open: true,
      plantillaId: plantillaId,
      plantillaNombre: nombrePlantilla
    });
    
    console.log('Diálogo de confirmación abierto para plantilla:', nombrePlantilla);
  }, [plantillas]);

  const handleConfirmEliminar = useCallback(async () => {
    const { plantillaId } = confirmDialog;
    
    if (!plantillaId) {
      console.error('No hay plantilla ID para eliminar');
      return;
    }

    try {
      console.log('Eliminando plantilla con ID:', plantillaId);
      await api.delete(`/plantillas/${plantillaId}`);
      
      // Actualizar la lista de plantillas
      setPlantillas(prev => prev.filter(p => p?.id !== plantillaId));
      
      // Cerrar el diálogo
      setConfirmDialog({ open: false, plantillaId: null, plantillaNombre: '' });
      
      toast.success('Plantilla eliminada exitosamente');
      console.log('Plantilla eliminada exitosamente');
      
      // Recargar estadísticas
      cargarEstadisticas();
      
    } catch (error) {
      console.error('Error al eliminar plantilla:', error);
      toast.error('Error al eliminar la plantilla');
    }
  }, [confirmDialog]);

  const handleCancelEliminar = useCallback(() => {
    console.log('Eliminación cancelada');
    setConfirmDialog({ open: false, plantillaId: null, plantillaNombre: '' });
  }, []);

  const handleCopiarEnlace = useCallback(() => {
    if (enlaceGenerado) {
      navigator.clipboard.writeText(enlaceGenerado);
      toast.success('Enlace copiado al portapapeles');
    }
  }, [enlaceGenerado]);

  const handleEnlaceGenerado = useCallback((enlace) => {
    console.log('Enlace generado recibido en Dashboard:', enlace);
    setEnlaceGenerado(enlace);
  }, []);

  // --- 3. EFECTOS Y CARGA DE DATOS ---

  const cargarDatos = useCallback(async () => {
    try {
      setLoading(true);
      
      // Debug: Verificar token
      const token = localStorage.getItem('token');
      console.log('🔍 DEBUG Frontend: Token existe?', !!token);
      if (token) {
        try {
          const decoded = jwtDecode(token);
          console.log('🔍 DEBUG Frontend: Usuario decodificado:', decoded);
        } catch (e) {
          console.log('🔍 DEBUG Frontend: Error decodificando token:', e.message);
        }
      }
      
      if (!token) {
        navigate('/login');
        return;
      }

      const decoded = jwtDecode(token);
      setEntrevistador(decoded);

      // Cargar color del avatar guardado
      const savedAvatarColor = localStorage.getItem('avatarColor') || '#2c5aa0';
      setAvatarColor(savedAvatarColor);

      // Cargar perfil del usuario para obtener la imagen
      try {
        const user = await userService.getUserProfile();
        if (user.profile_image) {
          setProfileImage(userService.getImageUrl(user.profile_image));
        }
      } catch (profileError) {
        console.log('No se pudo cargar el perfil del usuario:', profileError);
        // No es crítico, continuamos sin imagen de perfil
      }

      const [plantillasResponse, estadisticasResponse] = await Promise.all([
        api.get('/plantillas'),
        api.get('/estadisticas/dashboard')
      ]);

      console.log('🔍 DEBUG Frontend: Respuesta estadísticas:', estadisticasResponse.data);

      setPlantillas(plantillasResponse.data);
      setEstadisticas(estadisticasResponse.data);
      setEntrevistasCompletadas(estadisticasResponse.data.entrevistasCompletadas || []);

    } catch (error) {
      console.error('Error al cargar datos:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        toast.error('Error al cargar los datos del dashboard');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const cargarEstadisticas = useCallback(async () => {
    try {
      const response = await api.get('/estadisticas/dashboard');
      setEstadisticas(response.data);
      setEntrevistasCompletadas(response.data.entrevistasCompletadas || []);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  // --- 4. FILTRADO Y MEMOIZACIÓN ---

  const plantillasFiltradas = useMemo(() => {
    if (!searchTerm) return plantillas;
    return plantillas.filter(plantilla =>
      plantilla.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plantilla.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [plantillas, searchTerm]);

  // --- 5. RENDERIZADO ---

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* Header */}
      <AppBar position="static">
        <Toolbar sx={{ minHeight: 64 }}>
          <HomeIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ProfileAnalytics
          </Typography>
          
          {/* User info and actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {/* User avatar and name */}
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1, 
                mr: 2,
                cursor: 'pointer',
                borderRadius: 2,
                px: 1,
                py: 0.5,
                textDecoration: 'none',
                color: 'inherit',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                },
                '&:visited': {
                  color: 'inherit',
                  textDecoration: 'none'
                },
                '&:link': {
                  color: 'inherit',
                  textDecoration: 'none'
                }
              }}
              component={Link}
              to="/profile"
            >
              <ColorfulAvatar
                profileImage={profileImage}
                avatarColor={avatarColor}
                userName={entrevistador?.nombre || 'Usuario'}
                size={32}
                showControls={false}
              />
              <Typography variant="body2" sx={{ fontWeight: 500, color: 'inherit', textDecoration: 'none' }}>
                {entrevistador?.nombre || 'Usuario'}
              </Typography>
            </Box>
            
            {/* Security settings button - more compact */}
            <Button
              color="inherit"
              startIcon={<SecurityIcon />}
              component={Link}
              to="/security-settings"
              size="small"
              sx={{ 
                px: 2,
                py: 0.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '0.875rem',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              Seguridad
            </Button>
            
            {/* Logout button */}
            <Button
              color="inherit"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              size="small"
              sx={{ 
                px: 2,
                py: 0.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '0.875rem',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              Cerrar Sesión
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Estadísticas */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <AssignmentIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" color="primary">
                {estadisticas.totalPlantillas}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Plantillas Creadas
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" color="success.main">
                {estadisticas.totalEntrevistas}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Entrevistas Completadas
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <PeopleIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h4" color="info.main">
                {estadisticas.candidatosEvaluados}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Candidatos Evaluados
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <TrendingUpIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4" color="warning.main">
                {estadisticas.porcentajeAprobacion}%
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Tasa de Aceptación
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Botón principal - Diseño naranja con bordes redondeados */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => navigate('/dashboard/evaluacion')}
            sx={{ 
              px: 4, 
              py: 2,
              backgroundColor: '#ff9800',
              borderRadius: '25px',
              '&:hover': {
                backgroundColor: '#f57c00'
              },
              fontWeight: 'bold',
              fontSize: '1.1rem'
            }}
          >
            Evaluación de Candidatos
          </Button>
        </Box>



        <Grid container spacing={3}>
          {/* Columna izquierda */}
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column' }}>
            {/* Invitar Candidato */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <InvitarCandidato 
                  plantillas={plantillas} 
                  onEnlaceGenerado={handleEnlaceGenerado}
                />
              </CardContent>
            </Card>

            {/* Enlace generado */}
            {enlaceGenerado && (
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Enlace Generado
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TextField
                      fullWidth
                      value={enlaceGenerado}
                      variant="outlined"
                      size="small"
                      InputProps={{
                        readOnly: true,
                        startAdornment: (
                          <InputAdornment position="start">
                            <LinkIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <Button
                      variant="outlined"
                      startIcon={<ContentCopyIcon />}
                      onClick={handleCopiarEnlace}
                    >
                      Copiar
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            )}

            {/* Plantillas */}
            <Card sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6">
                    Plantillas de Entrevista
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/dashboard/crear-plantilla')}
                  >
                    Nueva Plantilla
                  </Button>
                </Box>

                <TextField
                  fullWidth
                  placeholder="Buscar plantillas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{ mb: 3 }}
                />

                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  {plantillasFiltradas.length > 0 ? (
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: 2,
                        '@media (min-width: 900px)': {
                          gridTemplateColumns: 'repeat(3, 1fr)', // Exactamente 3 columnas en pantallas grandes
                        }
                      }}
                    >
                      {plantillasFiltradas.map((plantilla) => (
                        <Box key={plantilla?.id}>
                          <PlantillaCard
                            plantilla={plantilla}
                            onEliminar={handleEliminar}
                          />
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <Box 
                      sx={{ 
                        textAlign: 'center', 
                        py: 6,
                        backgroundColor: 'grey.50',
                        borderRadius: 2,
                        border: '2px dashed',
                        borderColor: 'grey.300',
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                      }}
                    >
                      <AssignmentIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                      <Typography variant="h6" color="textSecondary" gutterBottom>
                        {searchTerm ? 'No se encontraron plantillas' : 'No hay plantillas creadas'}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {searchTerm 
                          ? 'Intenta con otros términos de búsqueda.' 
                          : 'Crea tu primera plantilla para comenzar.'
                        }
                      </Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Columna derecha */}
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column' }}>
            <Card sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                  Formularios completados
                </Typography>
                
                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  {entrevistasCompletadas.length > 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {entrevistasCompletadas.map((entrevista) => (
                        <Box key={entrevista.id} sx={{ width: '100%' }}>
                          <EntrevistaCompletadaCard 
                            entrevista={entrevista} 
                          />
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <Box 
                      sx={{ 
                        textAlign: 'center', 
                        py: 6,
                        backgroundColor: 'grey.50',
                        borderRadius: 2,
                        border: '2px dashed',
                        borderColor: 'grey.300',
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                      }}
                    >
                      <CheckCircleIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                      <Typography variant="h6" color="textSecondary" gutterBottom>
                        No hay entrevistas completadas
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Las entrevistas completadas aparecerán aquí.
                      </Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Diálogo de confirmación */}
      <ConfirmDialog
        open={confirmDialog.open}
        title="Confirmar Eliminación"
        message={`¿Estás seguro de que deseas eliminar la plantilla "${confirmDialog.plantillaNombre}"? Esta acción no se puede deshacer.`}
        onConfirm={handleConfirmEliminar}
        onClose={handleCancelEliminar}
      />
    </Box>
  );
}

export default DashboardPage;