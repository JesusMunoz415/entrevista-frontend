import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Visibility as VisibilityIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import ModulosDonutChart from './ModulosBarChart';

/**
 * Componente memoizado para mostrar una tarjeta de entrevista completada
 * Se re-renderiza solo cuando cambian sus props
 */
const EntrevistaCompletadaCard = memo(({ entrevista }) => {
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getColorPorcentaje = (porcentaje) => {
    if (porcentaje >= 80) return 'success';
    if (porcentaje >= 60) return 'warning';
    return 'error';
  };

  const getEstadoEvaluacion = () => {
    if (entrevista?.evaluacion_manual_estado === 'aprobado') {
      return { 
        label: 'Aprobado', 
        color: 'success', 
        icon: <CheckCircleIcon />
      };
    } else if (entrevista?.evaluacion_manual_estado === 'rechazado') {
      return { 
        label: 'Rechazado', 
        color: 'error', 
        icon: <CancelIcon />
      };
    } else {
      return { 
        label: 'Pendiente', 
        color: 'warning', 
        icon: <ScheduleIcon />
      };
    }
  };

  const estadoEvaluacion = getEstadoEvaluacion();

  return (
    <Card 
      elevation={1}
      sx={{ 
        width: '100%',
        height: '280px', // Aumentamos la altura para más espacio
        minHeight: '280px',
        display: 'flex', 
        flexDirection: 'row', // Cambiar a layout horizontal
        transition: 'all 0.3s ease-in-out',
        border: '1px solid',
        borderColor: 'grey.200',
        overflow: 'hidden', // Para mejor apariencia
        '&:hover': {
          elevation: 8,
          transform: 'translateY(-2px)',
          borderColor: 'primary.main',
          boxShadow: '0 8px 25px rgba(0,0,0,0.12)'
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 4, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <Box sx={{ mr: 1.5 }}>
            {estadoEvaluacion.icon}
          </Box>
          <Typography 
            variant="h6" 
            component="h3" 
            noWrap 
            sx={{ 
              fontWeight: 600
            }}
          >
            {entrevista?.candidato_nombre || 'Nombre no disponible'}
          </Typography>
        </Box>
        
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            mb: 2,
            lineHeight: 1.4
          }}
        >
          <strong>{entrevista?.candidato_email || 'Email no disponible'}</strong>
        </Typography>
        
        <Typography 
          variant="caption" 
          color="text.secondary" 
          sx={{ 
            mb: 2,
            display: 'block',
            lineHeight: 1.4,
            fontSize: '0.8rem'
          }}
        >
          Plantilla: {entrevista?.plantilla_titulo || 'No disponible'}
          <br />
          Completada: {entrevista?.fecha_completada ? formatearFecha(entrevista.fecha_completada) : 'Fecha no disponible'}
          {entrevista?.evaluacion_manual_fecha && (
            <>
              <br />
              Evaluada: {formatearFecha(entrevista.evaluacion_manual_fecha)}
            </>
          )}
        </Typography>

        <Box display="flex" gap={1} flexWrap="wrap" sx={{ mb: 2 }}>
          <Chip 
            label={estadoEvaluacion.label}
            size="small"
            color={estadoEvaluacion.color}
            variant="outlined"
            sx={{ fontWeight: 500, fontSize: '0.75rem' }}
          />
          <Chip 
            label={`IPG: ${entrevista?.ipg || 0}%`}
            size="small"
            color={getColorPorcentaje(entrevista?.ipg || 0)}
            variant="outlined"
            sx={{ fontWeight: 500, fontSize: '0.75rem' }}
          />
        </Box>
      </CardContent>

      {/* Sección de la gráfica */}
      <Box sx={{ 
        width: '320px', 
        p: 2, 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <ModulosDonutChart entrevistaId={entrevista?.id} />
      </Box>

      <CardActions sx={{ 
        flexDirection: 'column', 
        justifyContent: 'center', 
        px: 2, 
        py: 3, 
        minWidth: '130px',
        maxWidth: '130px',
        borderLeft: '1px solid',
        borderColor: 'grey.200'
      }}>
        <Button
          component={Link}
          to={`/dashboard/evaluacion/${entrevista?.id}`}
          variant="contained"
          startIcon={<VisibilityIcon />}
          size="medium"
          sx={{
            minHeight: '44px',
            fontSize: '0.8rem',
            fontWeight: 600,
            borderRadius: '10px',
            textTransform: 'none',
            backgroundColor: '#1976d2',
            boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)',
            whiteSpace: 'nowrap',
            px: 2,
            '&:hover': {
              backgroundColor: '#1565c0',
              boxShadow: '0 4px 12px rgba(25, 118, 210, 0.4)',
              transform: 'translateY(-1px)',
            },
            '&:active': {
              transform: 'translateY(0px)',
            },
            transition: 'all 0.2s ease-in-out'
          }}
        >
          Ver Detalles
        </Button>
      </CardActions>
    </Card>
  );
});

EntrevistaCompletadaCard.displayName = 'EntrevistaCompletadaCard';

export default EntrevistaCompletadaCard;