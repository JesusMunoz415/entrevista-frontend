import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, CircularProgress, Typography, Alert } from '@mui/material';
import toast from 'react-hot-toast';

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleCallback = () => {
      const token = searchParams.get('token');
      const error = searchParams.get('error');

      if (error) {
        // Manejar errores de autenticación
        let errorMessage = 'Error en la autenticación';
        
        switch (error) {
          case 'auth_failed':
            errorMessage = 'Falló la autenticación con Google';
            break;
          case 'server_error':
            errorMessage = 'Error del servidor durante la autenticación';
            break;
          default:
            errorMessage = 'Error desconocido en la autenticación';
        }
        
        toast.error(errorMessage);
        navigate('/login');
        return;
      }

      if (token) {
        try {
          // Guardar el token en localStorage
          localStorage.setItem('token', token);
          
          // Mostrar mensaje de éxito
          toast.success('¡Autenticación exitosa con Google!');
          
          // Redirigir al dashboard
          navigate('/dashboard');
        } catch (error) {
          console.error('Error procesando token:', error);
          toast.error('Error procesando la autenticación');
          navigate('/login');
        }
      } else {
        // No hay token ni error - algo salió mal
        toast.error('No se recibió token de autenticación');
        navigate('/login');
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="50vh"
      gap={3}
    >
      <CircularProgress size={60} />
      <Typography variant="h6" color="text.secondary">
        Procesando autenticación...
      </Typography>
      <Typography variant="body2" color="text.secondary" textAlign="center">
        Por favor espera mientras completamos tu inicio de sesión con Google.
      </Typography>
    </Box>
  );
};

export default AuthCallbackPage;