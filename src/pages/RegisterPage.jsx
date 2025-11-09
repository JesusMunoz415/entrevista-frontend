import React from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from '../components/RegisterForm';

// Importaciones de MUI
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';

// Iconos
import PersonAddIcon from '@mui/icons-material/PersonAdd';

function RegisterPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f7fa',
        backgroundImage: 'linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%)',
        py: 4,
      }}
    >
      <Container component="main" maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 2,
            backgroundColor: '#ffffff',
            border: '1px solid #e1e5e9',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 3,
              pb: 2,
              borderBottom: '1px solid #f0f2f5',
            }}
          >
            <Avatar
              sx={{
                m: 1,
                bgcolor: '#2c5aa0',
                width: 48,
                height: 48,
              }}
            >
              <PersonAddIcon sx={{ fontSize: 24 }} />
            </Avatar>
            <Typography
              component="h1"
              variant="h5"
              sx={{
                fontWeight: 600,
                color: '#2c3e50',
                fontSize: '1.5rem',
                textAlign: 'center',
              }}
            >
              Crear Cuenta
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#6c757d',
                textAlign: 'center',
                mt: 1,
              }}
            >
              Únete a ProfileAnalytics - Plataforma de Entrevistas
            </Typography>
          </Box>

          {/* Formulario */}
          <RegisterForm />

          {/* Footer */}
          <Box
            sx={{
              mt: 3,
              pt: 2,
              borderTop: '1px solid #f0f2f5',
              textAlign: 'center',
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: '#6c757d',
              }}
            >
              ¿Ya tienes una cuenta?{' '}
              <Link
                to="/login"
                style={{
                  color: '#2c5aa0',
                  textDecoration: 'none',
                  fontWeight: 500,
                }}
              >
                Inicia sesión aquí
              </Link>
            </Typography>
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

export default RegisterPage;