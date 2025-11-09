import React, { useState, useEffect } from 'react';
import { Backdrop, CircularProgress, Typography, Box } from '@mui/material';
import { onLoadingChange } from '../utils/axiosConfig';

/**
 * Componente de loading global que se muestra durante requests HTTP
 */
const GlobalLoading = () => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Suscribirse a cambios de loading
    const unsubscribe = onLoadingChange(setIsLoading);
    
    // Cleanup
    return unsubscribe;
  }, []);

  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
      }}
      open={isLoading}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={2}
      >
        <CircularProgress color="inherit" size={60} />
        <Typography variant="h6" component="div">
          Cargando...
        </Typography>
      </Box>
    </Backdrop>
  );
};

export default GlobalLoading;