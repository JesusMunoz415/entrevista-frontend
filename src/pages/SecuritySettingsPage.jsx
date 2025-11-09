import React, { useState } from 'react';
import { Container, Typography, Box, Breadcrumbs, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TwoFactorSetup from '../components/TwoFactorSetup';

// Iconos
import SecurityIcon from '@mui/icons-material/Security';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';

const SecuritySettingsPage = () => {
  const navigate = useNavigate();
  const [isConfiguring2FA, setIsConfiguring2FA] = useState(false);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          component="button"
          variant="body2"
          onClick={() => navigate('/dashboard')}
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            textDecoration: 'none',
            color: 'text.secondary',
            '&:hover': { 
              textDecoration: 'underline',
              color: 'text.primary'
            }
          }}
        >
          <HomeIcon sx={{ mr: 0.5, fontSize: 16 }} />
          Home
        </Link>
        <Typography 
          variant="body2" 
          color={isConfiguring2FA ? "text.secondary" : "primary"}
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            fontWeight: isConfiguring2FA ? 'normal' : 'medium'
          }}
        >
          <SecurityIcon sx={{ mr: 0.5, fontSize: 16 }} />
          Seguridad
        </Typography>
        {isConfiguring2FA && (
          <Typography 
            variant="body2" 
            color="primary"
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              fontWeight: 'medium'
            }}
          >
            <SettingsIcon sx={{ mr: 0.5, fontSize: 16 }} />
            Configuración
          </Typography>
        )}
      </Breadcrumbs>

      {/* Título de la página */}
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Configuración de Seguridad
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Administra la seguridad de tu cuenta y configura opciones de autenticación adicionales.
        </Typography>
      </Box>

      {/* Componente de configuración 2FA */}
      <TwoFactorSetup onConfigurationChange={setIsConfiguring2FA} />
    </Container>
  );
};

export default SecuritySettingsPage;