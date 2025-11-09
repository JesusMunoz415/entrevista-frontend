import React, { useState } from 'react';
import {
  Avatar,
  Badge,
  IconButton,
  CircularProgress,
  Box,
  Popover,
  Grid,
  Typography,
  Tooltip
} from '@mui/material';
import {
  CameraAlt as CameraAltIcon,
  Person as PersonIcon,
  Palette as PaletteIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

// Paleta de colores que combinan con el tema de la aplicación
const avatarColors = [
  { name: 'Azul Principal', color: '#2c5aa0' },
  { name: 'Verde Éxito', color: '#2e7d32' },
  { name: 'Naranja Advertencia', color: '#ed6c02' },
  { name: 'Rojo Error', color: '#d32f2f' },
  { name: 'Púrpura', color: '#7b1fa2' },
  { name: 'Índigo', color: '#303f9f' },
  { name: 'Teal', color: '#00695c' },
  { name: 'Rosa', color: '#c2185b' },
  { name: 'Marrón', color: '#5d4037' },
  { name: 'Gris Azulado', color: '#455a64' },
  { name: 'Azul Claro', color: '#0288d1' },
  { name: 'Verde Lima', color: '#689f38' }
];

const ColorfulAvatar = ({
  profileImage,
  avatarColor = '#2c5aa0',
  onColorChange,
  onImageUpload,
  onImageRemove,
  uploadingImage = false,
  size = 80,
  userName = 'Usuario',
  showControls = true
}) => {
  const [colorPickerAnchor, setColorPickerAnchor] = useState(null);

  const handleColorPickerOpen = (event) => {
    event.stopPropagation();
    setColorPickerAnchor(event.currentTarget);
  };

  const handleColorPickerClose = () => {
    setColorPickerAnchor(null);
  };

  const handleColorSelect = (color) => {
    onColorChange(color);
    handleColorPickerClose();
  };

  const triggerFileInput = () => {
    document.getElementById('profile-image-input').click();
  };

  const isColorPickerOpen = Boolean(colorPickerAnchor);

  return (
    <Box sx={{ position: 'relative', display: 'inline-block' }}>
      {/* Input oculto para seleccionar archivo */}
      <input
        id="profile-image-input"
        type="file"
        accept="image/*"
        onChange={onImageUpload}
        style={{ display: 'none' }}
      />
      
      {/* Avatar con badges para cámara, selector de color y eliminar imagen */}
      {showControls ? (
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={
            <Tooltip title="Cambiar foto">
              <IconButton
                size="small"
                onClick={triggerFileInput}
                disabled={uploadingImage}
                sx={{
                  bgcolor: 'secondary.main',
                  color: 'white',
                  width: 32,
                  height: 32,
                  '&:hover': {
                    bgcolor: 'secondary.dark',
                  },
                  '&:disabled': {
                    bgcolor: 'grey.400',
                  },
                }}
              >
                {uploadingImage ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <CameraAltIcon fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
          }
        >
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            badgeContent={
              !profileImage ? (
                <Tooltip title="Cambiar color del avatar">
                  <IconButton
                    size="small"
                    onClick={handleColorPickerOpen}
                    sx={{
                      bgcolor: 'info.main',
                      color: 'white',
                      width: 28,
                      height: 28,
                      '&:hover': {
                        bgcolor: 'info.dark',
                      },
                    }}
                  >
                    <PaletteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              ) : null
            }
          >
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
              badgeContent={
                profileImage && onImageRemove ? (
                  <Tooltip title="Quitar foto">
                    <IconButton
                      size="small"
                      onClick={onImageRemove}
                      sx={{
                        bgcolor: 'error.main',
                        color: 'white',
                        width: 28,
                        height: 28,
                        '&:hover': {
                          bgcolor: 'error.dark',
                        },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                ) : null
              }
            >
            <Avatar 
              src={profileImage}
              sx={{ 
                bgcolor: profileImage ? 'transparent' : avatarColor,
                width: size, 
                height: size, 
                fontSize: `${size * 0.4}px`,
                cursor: showControls ? 'pointer' : 'default',
                transition: 'all 0.3s ease',
                '&:hover': showControls ? {
                  opacity: 0.8,
                  transform: 'scale(1.05)',
                } : {},
              }}
              onClick={showControls ? triggerFileInput : undefined}
            >
              {!profileImage && <PersonIcon sx={{ fontSize: `${size * 0.6}px` }} />}
            </Avatar>
            </Badge>
          </Badge>
        </Badge>
      ) : (
        <Avatar 
          src={profileImage}
          sx={{ 
            bgcolor: profileImage ? 'transparent' : avatarColor,
            width: size, 
            height: size, 
            fontSize: `${size * 0.4}px`,
            cursor: 'default',
          }}
        >
          {!profileImage && <PersonIcon sx={{ fontSize: `${size * 0.6}px` }} />}
        </Avatar>
      )}

      {/* Popover del selector de colores */}
      {showControls && (
        <Popover
          open={isColorPickerOpen}
          anchorEl={colorPickerAnchor}
          onClose={handleColorPickerClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          sx={{
            '& .MuiPopover-paper': {
              p: 2,
              borderRadius: 2,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            }
          }}
        >
        <Box sx={{ width: 280 }}>
          <Typography variant="subtitle2" gutterBottom sx={{ textAlign: 'center', mb: 2 }}>
            Elige un color para tu avatar
          </Typography>
          <Grid container spacing={1}>
            {avatarColors.map((colorOption) => (
              <Grid item xs={3} key={colorOption.color}>
                <Tooltip title={colorOption.name}>
                  <IconButton
                    onClick={() => handleColorSelect(colorOption.color)}
                    sx={{
                      width: 48,
                      height: 48,
                      bgcolor: colorOption.color,
                      border: avatarColor === colorOption.color ? '3px solid #fff' : '1px solid rgba(0,0,0,0.1)',
                      boxShadow: avatarColor === colorOption.color ? '0 0 0 2px #2c5aa0' : 'none',
                      '&:hover': {
                        transform: 'scale(1.1)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <PersonIcon sx={{ color: 'white', fontSize: '1.2rem' }} />
                  </IconButton>
                </Tooltip>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Popover>
      )}
    </Box>
  );
};

export default ColorfulAvatar;