import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../components/LoginForm';

// Importaciones de MUI
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';

// Iconos
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import GoogleIcon from '@mui/icons-material/Google';
import LoginIcon from '@mui/icons-material/Login';

function LoginPage() {
  // La URL de Google login debe ser directa al backend ya que es una redirección
  const googleLoginUrl = 'http://localhost:3001/api/auth/google';

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#f8f9fa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 3
      }}
    >
      <Container component="main" maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            borderRadius: 2,
            border: '1px solid #e1e5e9',
            background: '#ffffff',
            overflow: 'hidden'
          }}
        >
          {/* Header Section */}
          <Box
            sx={{
              background: '#2c5aa0',
              color: 'white',
              py: 4,
              textAlign: 'center'
            }}
          >
            <Avatar
              sx={{
                mx: 'auto',
                mb: 2,
                bgcolor: 'rgba(255, 255, 255, 0.15)',
                width: 56,
                height: 56
              }}
            >
              <LockOutlinedIcon sx={{ fontSize: 28 }} />
            </Avatar>
            <Typography component="h1" variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
              Iniciar Sesión
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, fontWeight: 400 }}>
              ProfileAnalytics - Sistema de Evaluación Psicométrica
            </Typography>
          </Box>

          {/* Form Section */}
          <Box sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography component="h2" variant="h6" sx={{ fontWeight: 500, color: '#2c3e50', mb: 1 }}>
                Accede a tu cuenta
              </Typography>
              <Typography variant="body2" color="#6c757d" sx={{ fontSize: '0.9rem' }}>
                Ingresa tus credenciales para continuar
              </Typography>
            </Box>
            
            <LoginForm />

            <Divider sx={{ my: 3, color: '#6c757d' }}>
              <Typography variant="body2" sx={{ color: '#6c757d', fontSize: '0.85rem' }}>
                O continúa con
              </Typography>
            </Divider>
            
            <Button
              variant="outlined"
              fullWidth
              href={googleLoginUrl}
              startIcon={<GoogleIcon />}
              sx={{
                py: 1.2,
                borderRadius: 1.5,
                textTransform: 'none',
                fontSize: '0.95rem',
                fontWeight: 500,
                borderColor: '#dadce0',
                color: '#3c4043',
                backgroundColor: '#ffffff',
                '&:hover': {
                  borderColor: '#bdc1c6',
                  backgroundColor: '#f8f9fa'
                }
              }}
            >
              Continuar con Google
            </Button>

            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="body2" sx={{ color: '#6c757d', fontSize: '0.9rem' }}>
                ¿No tienes una cuenta?{' '}
                <Link 
                  to="/register" 
                  style={{ 
                    color: '#2c5aa0', 
                    textDecoration: 'none',
                    fontWeight: 500
                  }}
                >
                  Regístrate aquí
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Footer */}
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="body2" sx={{ color: '#6c757d', fontSize: '0.85rem' }}>
            © 2024 Sistema de Evaluación Psicométrica. Todos los derechos reservados.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default LoginPage;