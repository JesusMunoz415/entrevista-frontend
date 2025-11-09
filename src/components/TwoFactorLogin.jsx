import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axiosConfig';
import toast from 'react-hot-toast';

// Importaciones de MUI
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Divider,
  Link
} from '@mui/material';

// Iconos
import SecurityIcon from '@mui/icons-material/Security';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import BackupIcon from '@mui/icons-material/Backup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const TwoFactorLogin = ({ tempToken, email, onBack }) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [showBackupCode, setShowBackupCode] = useState(false);
  const [backupCode, setBackupCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutos
  const navigate = useNavigate();

  useEffect(() => {
    // Countdown timer para el token temporal
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          toast.error('El token ha expirado. Por favor, inicia sesión nuevamente.');
          onBack();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onBack]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerification = async (code, isBackupCode = false) => {
    if (!code || (isBackupCode ? code.length !== 8 : code.length !== 6)) {
      toast.error(`Por favor, ingresa un código ${isBackupCode ? 'de respaldo' : 'de autenticación'} válido`);
      return;
    }

    try {
      setIsVerifying(true);
      
      const response = await api.post('/auth/complete-2fa-login', {
        tempToken,
        token: isBackupCode ? null : code,
        backupCode: isBackupCode ? code : null
      });

      // Guardar token de autenticación
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.usuario));
      
      toast.success('Autenticación exitosa');
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Error en verificación 2FA:', error);
      const errorMessage = error.response?.data?.mensaje || 'Error en la verificación';
      toast.error(errorMessage);
      
      // Si el código de respaldo fue usado, limpiar el campo
      if (isBackupCode) {
        setBackupCode('');
      } else {
        setVerificationCode('');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCodeSubmit = (e) => {
    e.preventDefault();
    handleVerification(verificationCode, false);
  };

  const handleBackupCodeSubmit = (e) => {
    e.preventDefault();
    handleVerification(backupCode, true);
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" p={2}>
      <Card sx={{ maxWidth: 400, width: '100%' }}>
        <CardContent sx={{ p: 4 }}>
          <Box textAlign="center" mb={3}>
            <SecurityIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" component="h1" gutterBottom>
              Verificación 2FA
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ingresa el código de tu aplicación de autenticación para {email}
            </Typography>
          </Box>

          {/* Contador de tiempo */}
          <Alert 
            severity={timeLeft < 60 ? 'warning' : 'info'} 
            sx={{ mb: 3 }}
          >
            <Typography variant="body2">
              Token expira en: <strong>{formatTime(timeLeft)}</strong>
            </Typography>
          </Alert>

          {!showBackupCode ? (
            <Box component="form" onSubmit={handleCodeSubmit}>
              <Box display="flex" alignItems="center" mb={2}>
                <PhoneAndroidIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  Código de autenticación
                </Typography>
              </Box>

              <TextField
                fullWidth
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                inputProps={{ 
                  style: { 
                    textAlign: 'center', 
                    fontSize: '1.5rem', 
                    letterSpacing: '0.5rem',
                    fontFamily: 'monospace'
                  },
                  maxLength: 6
                }}
                sx={{ mb: 3 }}
                autoFocus
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isVerifying || verificationCode.length !== 6}
                startIcon={isVerifying ? <CircularProgress size={20} /> : <SecurityIcon />}
                sx={{ mb: 2 }}
              >
                {isVerifying ? 'Verificando...' : 'Verificar código'}
              </Button>

              <Divider sx={{ my: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  o
                </Typography>
              </Divider>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<BackupIcon />}
                onClick={() => setShowBackupCode(true)}
                sx={{ mb: 2 }}
              >
                Usar código de respaldo
              </Button>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleBackupCodeSubmit}>
              <Box display="flex" alignItems="center" mb={2}>
                <BackupIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  Código de respaldo
                </Typography>
              </Box>

              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  Ingresa uno de los códigos de respaldo de 8 caracteres que guardaste cuando configuraste 2FA.
                </Typography>
              </Alert>

              <TextField
                fullWidth
                value={backupCode}
                onChange={(e) => setBackupCode(e.target.value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8).toUpperCase())}
                placeholder="ABCD1234"
                inputProps={{ 
                  style: { 
                    textAlign: 'center', 
                    fontSize: '1.2rem', 
                    letterSpacing: '0.3rem',
                    fontFamily: 'monospace'
                  },
                  maxLength: 8
                }}
                sx={{ mb: 3 }}
                autoFocus
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isVerifying || backupCode.length !== 8}
                startIcon={isVerifying ? <CircularProgress size={20} /> : <BackupIcon />}
                sx={{ mb: 2 }}
              >
                {isVerifying ? 'Verificando...' : 'Usar código de respaldo'}
              </Button>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<PhoneAndroidIcon />}
                onClick={() => {
                  setShowBackupCode(false);
                  setBackupCode('');
                }}
              >
                Volver al código de autenticación
              </Button>
            </Box>
          )}

          <Divider sx={{ my: 3 }} />

          <Box textAlign="center">
            <Link
              component="button"
              variant="body2"
              onClick={onBack}
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              <ArrowBackIcon sx={{ mr: 0.5, fontSize: 16 }} />
              Volver al login
            </Link>
          </Box>

          <Box mt={3}>
            <Alert severity="info">
              <Typography variant="body2">
                <strong>¿Problemas para acceder?</strong><br />
                • Verifica que la hora de tu dispositivo sea correcta<br />
                • Asegúrate de usar la aplicación correcta<br />
                • Si perdiste tu dispositivo, usa un código de respaldo
              </Typography>
            </Alert>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TwoFactorLogin;