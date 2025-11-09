import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Chip,
  Box,
  Tooltip
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';

/**
 * Componente memoizado para mostrar una tarjeta de plantilla
 * Se re-renderiza solo cuando cambian sus props
 */
const PlantillaCard = memo(({ 
  plantilla, 
  onEliminar 
}) => {
  const handleEliminar = () => {
    console.log('PlantillaCard: handleEliminar llamado para plantilla ID:', plantilla?.id);
    
    // Simplemente llamar a la función del padre sin capturar resultado
    onEliminar(plantilla?.id);
  };

  return (
    <Card 
      elevation={1}
      sx={{ 
        height: '100%', // Usar altura completa del contenedor
        minHeight: '280px', // Altura mínima más compacta
        maxHeight: '280px', // Altura máxima fija más compacta
        width: '100%',
        maxWidth: '400px', // Ancho máximo para asegurar 3 por fila
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease-in-out',
        border: '1px solid',
        borderColor: 'grey.200',
        borderRadius: 2,
        '&:hover': {
          elevation: 8,
          transform: 'translateY(-4px)',
          borderColor: 'primary.main',
          boxShadow: '0 8px 25px rgba(0,0,0,0.12)'
        }
      }}
    >
      <CardContent sx={{ 
        flexGrow: 1, 
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: 'calc(100% - 56px)' // Restar altura de CardActions más compacta
      }}>
        {/* Header con icono y título */}
        <Box>
          <Box display="flex" alignItems="flex-start" mb={1.5}>
            <AssignmentIcon 
              color="primary" 
              sx={{ 
                mr: 1.5, 
                fontSize: 24,
                mt: 0.5,
                flexShrink: 0
              }} 
            />
            <Typography 
              variant="h6" 
              component="h3" 
              sx={{ 
                fontWeight: 600, 
                fontSize: '1rem',
                lineHeight: 1.2,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                minHeight: '2.4em',
                maxHeight: '2.4em'
              }}
            >
              {plantilla.nombre}
            </Typography>
          </Box>
          
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mb: 3,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.4,
              minHeight: '4.2em',
              maxHeight: '4.2em',
              fontSize: '0.875rem'
            }}
          >
            {plantilla.descripcion || 'Sin descripción disponible'}
          </Typography>
        </Box>

        {/* Chips informativos */}
        <Box display="flex" gap={1} flexWrap="wrap" justifyContent="flex-start">
          <Chip 
            label={`${plantilla.preguntas?.length || 0} preguntas`}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ 
              fontWeight: 500, 
              fontSize: '0.75rem',
              height: '24px'
            }}
          />
          <Chip 
            label={new Date(plantilla.creado_en).toLocaleDateString()}
            size="small"
            color="default"
            variant="outlined"
            sx={{ 
              fontSize: '0.75rem',
              height: '24px'
            }}
          />
        </Box>
      </CardContent>

      <CardActions sx={{ 
        justifyContent: 'space-between', 
        px: 3, 
        pb: 2.5, 
        pt: 0,
        borderTop: '1px solid',
        borderColor: 'grey.100',
        backgroundColor: 'grey.50'
      }}>
        <Box display="flex" gap={1}>
          <Tooltip title="Ver detalles">
            <IconButton 
              component={Link} 
              to={`/dashboard/plantillas/${plantilla?.id}`}
              color="primary"
              size="medium"
              sx={{
                backgroundColor: 'primary.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                  transform: 'scale(1.05)'
                },
                transition: 'all 0.2s ease-in-out'
              }}
            >
              <AssignmentIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Editar plantilla">
            <IconButton 
              component={Link} 
              to={`/dashboard/plantillas/editar/${plantilla?.id}`}
              color="info"
              size="medium"
              sx={{
                backgroundColor: 'info.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'info.dark',
                  transform: 'scale(1.05)'
                },
                transition: 'all 0.2s ease-in-out'
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        <Tooltip title="Eliminar plantilla">
          <IconButton 
            onClick={(e) => {
              console.log('Click event triggered on delete button');
              e.preventDefault();
              e.stopPropagation();
              handleEliminar();
            }}
            color="error"
            size="medium"
            sx={{
              backgroundColor: 'error.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'error.dark',
                transform: 'scale(1.05)'
              },
              transition: 'all 0.2s ease-in-out'
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
});

PlantillaCard.displayName = 'PlantillaCard';

export default PlantillaCard;