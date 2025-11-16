// frontend/src/pages/ProfilePage.jsx

import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/axiosConfig';
import toast from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';
import userService from '../services/userService';
import ColorfulAvatar from '../components/ColorfulAvatar';

// Importaciones de MUI
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
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
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';

// Iconos
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PsychologyIcon from '@mui/icons-material/Psychology';
import PeopleIcon from '@mui/icons-material/People';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import SecurityIcon from '@mui/icons-material/Security';
import WorkIcon from '@mui/icons-material/Work';
import BusinessIcon from '@mui/icons-material/Business';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

function ProfilePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [entrevistador, setEntrevistador] = useState(null);
  const [estadisticas, setEstadisticas] = useState({});
  const [tareasRecientes, setTareasRecientes] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [avatarColor, setAvatarColor] = useState('#2c5aa0');

  // Función para determinar el color del IPG basado en rangos de rendimiento
  const getIPGColor = (ipg) => {
    if (ipg < 50) {
      return 'error'; // Rojo - Por debajo de la media
    } else if (ipg >= 50 && ipg < 75) {
      return 'warning'; // Amarillo - En la media
    } else {
      return 'success'; // Verde - Arriba de la media
    }
  };

  // Función para obtener el color de fondo del IPG
  const getIPGBackgroundColor = (ipg) => {
    if (ipg < 50) {
      return 'error.main'; // Rojo
    } else if (ipg >= 50 && ipg < 75) {
      return 'warning.main'; // Amarillo/Naranja
    } else {
      return 'success.main'; // Verde
    }
  };

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    navigate('/login');
  }, [navigate]);

  const cargarDatos = useCallback(async () => {
    try {
      console.log('🔍 DEBUG ProfilePage - Iniciando carga de datos...');
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.log('🔍 DEBUG ProfilePage - No hay token, redirigiendo...');
        navigate('/login');
        return;
      }

      const decoded = jwtDecode(token);
      console.log('🔍 DEBUG ProfilePage - Usuario decodificado:', decoded);
      setEntrevistador(decoded);

      // Cargar estadísticas del dashboard
      console.log('🔍 DEBUG ProfilePage - Haciendo llamada a /estadisticas/dashboard...');
      const estadisticasResponse = await api.get('/estadisticas/dashboard');
      console.log('🔍 DEBUG ProfilePage - Estadísticas Response:', estadisticasResponse.data);
      console.log('🔍 DEBUG ProfilePage - promedioCalificacion:', estadisticasResponse.data.promedioCalificacion);
      setEstadisticas(estadisticasResponse.data);

      // Convertir entrevistas completadas a formato de tareas recientes
      const entrevistasCompletadas = estadisticasResponse.data.entrevistasCompletadas || [];
      const tareasReales = entrevistasCompletadas.slice(0, 5).map(entrevista => {
        // Determinar el tipo y estado basado en la evaluación manual
        let tipo, estado;
        if (entrevista.evaluacion_manual_estado === 'pendiente') {
          tipo = 'evaluacion_pendiente';
          estado = 'pendiente';
        } else if (entrevista.evaluacion_manual_estado === 'aprobado') {
          tipo = 'evaluacion_completada';
          estado = 'completado';
        } else if (entrevista.evaluacion_manual_estado === 'rechazado') {
          tipo = 'evaluacion_completada';
          estado = 'completado';
        } else {
          tipo = 'evaluacion_completada';
          estado = 'completado';
        }

        return {
          id: entrevista.id,
          tipo: tipo,
          titulo: `Evaluación de ${entrevista.candidato_nombre}`,
          descripcion: `Entrevista para ${entrevista.plantilla_titulo}`,
          fecha: entrevista.fecha_completada,
          estado: estado,
          evaluacionEstado: entrevista.evaluacion_manual_estado,
          ipg: entrevista.ipg_final
        };
      });

      setTareasRecientes(tareasReales);

      // Cargar perfil del usuario (incluyendo imagen y preferencias)
      try {
        const profileResponse = await userService.getUserProfile();
        if (profileResponse.success) {
          const user = profileResponse.user;
          
          // Cargar imagen de perfil
          if (user.profile_image) {
            setProfileImage(userService.getImageUrl(user.profile_image));
          }
          
          // Cargar color del avatar guardado o usar el color por defecto
          const savedAvatarColor = localStorage.getItem('avatarColor') || '#2c5aa0';
          setAvatarColor(savedAvatarColor);
          
          // Actualizar datos del entrevistador con información completa del perfil
          setEntrevistador(prev => ({
            ...prev,
            ...user,
            // Usar la fecha de creación del usuario si está disponible
            fechaRegistro: user.creado_en || user.created_at || user.fecha_registro || (prev?.iat ? new Date(prev.iat * 1000).toISOString() : null)
          }));
        }
      } catch (profileError) {
        console.log('No se pudo cargar la imagen de perfil:', profileError.message);
        // Cargar color del avatar guardado aunque falle la carga del perfil
        const savedAvatarColor = localStorage.getItem('avatarColor') || '#2c5aa0';
        setAvatarColor(savedAvatarColor);
        
        // Si no se puede cargar el perfil, usar la fecha del token JWT
        if (decoded?.iat) {
          setEntrevistador(prev => ({
            ...prev,
            fechaRegistro: new Date(decoded.iat * 1000).toISOString()
          }));
        }
      }

    } catch (error) {
      console.error('Error al cargar datos del perfil:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        toast.error('Error al cargar los datos del perfil');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const obtenerIconoTarea = (tipo) => {
    switch (tipo) {
      case 'evaluacion_pendiente':
        return <PendingActionsIcon color="warning" />;
      case 'evaluacion_completada':
        return <CheckCircleIcon color="success" />;
      case 'plantilla_creada':
        return <AssignmentIcon color="primary" />;
      default:
        return <WorkIcon />;
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona un archivo de imagen válido');
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen debe ser menor a 5MB');
      return;
    }

    try {
      setUploadingImage(true);
      
      // Subir imagen usando el servicio
      const response = await userService.uploadProfileImage(file);

      // Actualizar la imagen en el estado
      setProfileImage(userService.getImageUrl(response.imageUrl));
      toast.success('Foto de perfil actualizada correctamente');
      
    } catch (error) {
      console.error('Error al subir imagen:', error);
      toast.error(error.message || 'Error al subir la imagen. Inténtalo de nuevo.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageRemove = async () => {
    try {
      setUploadingImage(true);
      
      // Eliminar imagen usando el servicio
      await userService.removeProfileImage();

      // Limpiar la imagen del estado
      setProfileImage(null);
      toast.success('Foto de perfil eliminada correctamente');
      
    } catch (error) {
      console.error('Error al eliminar imagen:', error);
      toast.error(error.message || 'Error al eliminar la imagen. Inténtalo de nuevo.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAvatarColorChange = (newColor) => {
    setAvatarColor(newColor);
    // Guardar el color en localStorage para persistencia
    localStorage.setItem('avatarColor', newColor);
    toast.success('Color del avatar actualizado');
  };

  const triggerFileInput = () => {
    document.getElementById('profile-image-input').click();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Header */}
      <AppBar position="static">
        <Toolbar sx={{ minHeight: 64 }}>
          <IconButton
            color="inherit"
            onClick={() => navigate('/dashboard')}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ProfileAnalytics - Mi Perfil
          </Typography>
          
          {/* User info and actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {/* Security settings button */}
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

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3} justifyContent="center">
          {/* Información Personal - Centrada */}
          <Grid item xs={12} md={5} lg={4}>
            <Card sx={{ height: 'fit-content' }}>
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                  {/* Avatar con funcionalidad de cambio de foto y color */}
                  <ColorfulAvatar
                    profileImage={profileImage}
                    avatarColor={avatarColor}
                    onColorChange={handleAvatarColorChange}
                    onImageUpload={handleImageUpload}
                    onImageRemove={handleImageRemove}
                    uploadingImage={uploadingImage}
                    size={80}
                    userName={entrevistador?.nombre || 'Usuario'}
                  />
                  
                  <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
                    {entrevistador?.nombre || 'Usuario'}
                  </Typography>
                  <Chip 
                    label="Evaluador" 
                    color="primary" 
                    variant="outlined"
                    icon={<WorkIcon />}
                  />
                </Box>

                <Divider sx={{ mb: 2 }} />

                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <EmailIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Email"
                      secondary={entrevistador?.email || 'No disponible'}
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <BusinessIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Empresa"
                      secondary={entrevistador?.empresa || 'ProfileAnalytics'}
                    />
                  </ListItem>

                  <ListItem>
                    <ListItemIcon>
                      <CalendarTodayIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Miembro desde"
                      secondary={entrevistador?.fechaRegistro ? 
                        formatearFecha(entrevistador.fechaRegistro) : 
                        'Información no disponible'
                      }
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Estadísticas y Métricas */}
          <Grid item xs={12} md={7} lg={6}>
            <Stack spacing={3}>
              {/* Estadísticas Generales */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrendingUpIcon color="primary" />
                    Estadísticas Generales
                  </Typography>
                  
                  <Grid container spacing={2} sx={{ mt: 1 }} justifyContent="center">
                    <Grid item xs={6} md={6} lg={3}>
                      <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.50' }}>
                        <AssignmentIcon sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
                        <Typography variant="h4" color="primary">
                          {estadisticas.totalPlantillas || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Plantillas
                        </Typography>
                      </Paper>
                    </Grid>

                    <Grid item xs={6} md={6} lg={3}>
                      <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.50' }}>
                        <PeopleIcon sx={{ fontSize: 32, color: 'success.main', mb: 1 }} />
                        <Typography variant="h4" color="success.main">
                          {estadisticas.totalEntrevistas || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Entrevistas
                        </Typography>
                      </Paper>
                    </Grid>

                    <Grid item xs={6} md={6} lg={3}>
                      <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.50' }}>
                        <PendingActionsIcon sx={{ fontSize: 32, color: 'warning.main', mb: 1 }} />
                        <Typography variant="h4" color="warning.main">
                          {estadisticas.entrevistasPendientes || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Pendientes
                        </Typography>
                      </Paper>
                    </Grid>

                    <Grid item xs={6} md={6} lg={3}>
                      <Paper sx={{ 
                        p: 2, 
                        textAlign: 'center', 
                        bgcolor: `${getIPGColor(estadisticas.promedioCalificacion || 0)}.50` 
                      }}>
                        <PsychologyIcon sx={{ 
                          fontSize: 32, 
                          color: `${getIPGColor(estadisticas.promedioCalificacion || 0)}.main`, 
                          mb: 1 
                        }} />
                        <Typography 
                          variant="h4" 
                          color={`${getIPGColor(estadisticas.promedioCalificacion || 0)}.main`}
                        >
                          {estadisticas.promedioCalificacion ? 
                            estadisticas.promedioCalificacion.toFixed(1) : '0.0'
                          }
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Promedio IPG
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Actividad Reciente */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PendingActionsIcon color="primary" />
                    Actividad Reciente
                  </Typography>
                  
                  <List>
                    {tareasRecientes.map((tarea, index) => (
                      <React.Fragment key={tarea.id}>
                        <ListItem>
                          <ListItemIcon>
                            {obtenerIconoTarea(tarea.tipo)}
                          </ListItemIcon>
                          <ListItemText
                            primary={tarea.titulo}
                            secondary={
                              <Box>
                                <Typography variant="body2" color="text.secondary">
                                  {tarea.descripcion}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                  <Typography variant="caption" color="text.secondary">
                                    {formatearFecha(tarea.fecha)}
                                  </Typography>
                                  {tarea.ipg && (
                                    <>
                                      <Typography variant="caption" color="text.secondary">•</Typography>
                                      <Box 
                                        sx={{ 
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          backgroundColor: getIPGBackgroundColor(tarea.ipg),
                                          color: 'white',
                                          px: 1,
                                          py: 0.25,
                                          borderRadius: 1,
                                          fontSize: '0.75rem',
                                          fontWeight: 'medium'
                                        }}
                                      >
                                        IPG: {tarea.ipg}
                                      </Box>
                                    </>
                                  )}
                                </Box>
                              </Box>
                            }
                            secondaryTypographyProps={{ component: 'div' }}
                          />
                          <Box sx={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'flex-end', 
                            gap: 1,
                            ml: 2,
                            minWidth: 140
                          }}>
                            <Chip 
                              label={
                                tarea.evaluacionEstado === 'pendiente' ? 'Pendiente Evaluación' :
                                tarea.evaluacionEstado === 'aprobado' ? 'Aprobado' :
                                tarea.evaluacionEstado === 'rechazado' ? 'Rechazado' :
                                'Completado'
                              }
                              color={
                                tarea.evaluacionEstado === 'pendiente' ? 'warning' :
                                tarea.evaluacionEstado === 'aprobado' ? 'success' :
                                tarea.evaluacionEstado === 'rechazado' ? 'error' :
                                'default'
                              }
                              size="small"
                              sx={{
                                fontWeight: 'medium',
                                minWidth: 120,
                                '& .MuiChip-label': {
                                  px: 1.5
                                }
                              }}
                            />
                          </Box>
                        </ListItem>
                        {index < tareasRecientes.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>

                  {tareasRecientes.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 3 }}>
                      <Typography variant="body2" color="text.secondary">
                        No hay actividad reciente
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default ProfilePage;