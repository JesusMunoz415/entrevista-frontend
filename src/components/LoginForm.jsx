import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axiosConfig';
import toast from 'react-hot-toast';
import TwoFactorLogin from './TwoFactorLogin';

// Importaciones de MUI
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

// Iconos
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LoginIcon from '@mui/icons-material/Login';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [tempToken, setTempToken] = useState('');
  const navigate = useNavigate();

  // Función para validar formato de email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Función para manejar cambios en el email
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError('');
    setLoginError('');
    
    if (value && !validateEmail(value)) {
      setEmailError('Por favor, ingresa un correo electrónico válido');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('🚀 Iniciando proceso de login...');
    console.log('Email:', email);
    console.log('Password length:', password.length);
    
    // Validar email antes de enviar
    if (!validateEmail(email)) {
      setEmailError('Por favor, ingresa un correo electrónico válido');
      return;
    }
    
    setLoading(true);
    setEmailError('');
    setLoginError('');

    try {
      console.log('📡 Enviando petición de login...');
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      console.log('✅ Respuesta recibida:', response.data);
      console.log('Status:', response.status);
      console.log('requires2FA:', response.data.requires2FA);
      console.log('tempToken:', response.data.tempToken ? 'Presente' : 'Ausente');

      // Verificar si requiere 2FA
      if (response.data.requires2FA) {
        console.log('🔐 2FA requerido, mostrando pantalla 2FA');
        setTempToken(response.data.tempToken);
        setShowTwoFactor(true);
        toast.success('Credenciales correctas. Ingresa tu código 2FA.');
      } else if (response.data.token) {
        console.log('✅ Login exitoso sin 2FA');
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.usuario));
        toast.success('¡Inicio de sesión exitoso!');
        navigate('/dashboard');
      } else {
        console.log('⚠️ Respuesta inesperada:', response.data);
      }
    } catch (error) {
      console.error('❌ Error en login:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      const errorMessage = error.response?.data?.message || error.response?.data?.mensaje;
      
      if (error.response?.status === 401) {
        setLoginError('Credenciales incorrectas. Verifica tu email y contraseña.');
      } else if (error.response?.status === 404) {
        setLoginError('Usuario no encontrado. Verifica tu email o regístrate.');
      } else {
        setLoginError(errorMessage || 'Error al iniciar sesión. Inténtalo de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleBackFrom2FA = () => {
    setShowTwoFactor(false);
    setTempToken('');
    setPassword('');
  };

  // Si se requiere 2FA, mostrar el componente de verificación
  if (showTwoFactor) {
    return (
      <TwoFactorLogin 
        tempToken={tempToken}
        email={email}
        onBack={handleBackFrom2FA}
      />
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Correo Electrónico"
        name="email"
        autoComplete="email"
        autoFocus
        value={email}
        onChange={handleEmailChange}
        disabled={loading}
        error={!!emailError}
        helperText={emailError}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <EmailIcon sx={{ color: '#6c757d' }} />
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 1.5,
            backgroundColor: '#f8f9fa',
            '& fieldset': {
              borderColor: '#e1e5e9',
            },
            '&:hover fieldset': {
              borderColor: '#2c5aa0',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#2c5aa0',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#6c757d',
            fontSize: '0.9rem',
            '&.Mui-focused': {
              color: '#2c5aa0',
            },
          },
        }}
      />
      
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Contraseña"
        type={showPassword ? 'text' : 'password'}
        id="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockIcon sx={{ color: '#6c757d' }} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleTogglePasswordVisibility}
                edge="end"
                disabled={loading}
                sx={{ color: '#6c757d' }}
              >
                {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 1.5,
            backgroundColor: '#f8f9fa',
            '& fieldset': {
              borderColor: '#e1e5e9',
            },
            '&:hover fieldset': {
              borderColor: '#2c5aa0',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#2c5aa0',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#6c757d',
            fontSize: '0.9rem',
            '&.Mui-focused': {
              color: '#2c5aa0',
            },
          },
        }}
      />
      
      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={loading}
        startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <LoginIcon />}
        sx={{
          mt: 3,
          mb: 2,
          py: 1.2,
          borderRadius: 1.5,
          textTransform: 'none',
          fontSize: '0.95rem',
          fontWeight: 500,
          backgroundColor: '#2c5aa0',
          boxShadow: '0 2px 8px rgba(44, 90, 160, 0.2)',
          '&:hover': {
            backgroundColor: '#1e3f73',
            boxShadow: '0 4px 12px rgba(44, 90, 160, 0.3)',
          },
          '&:disabled': {
            backgroundColor: '#bdc1c6',
            boxShadow: 'none',
          },
          transition: 'all 0.2s ease',
        }}
      >
        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </Button>

      {/* Mensaje de error de login */}
      {loginError && (
        <Typography
          variant="body2"
          sx={{
            color: '#d32f2f',
            textAlign: 'center',
            mt: 2,
            fontSize: '0.875rem',
            fontWeight: 500,
          }}
        >
          {loginError}
        </Typography>
      )}
    </Box>
  );
}

export default LoginForm;