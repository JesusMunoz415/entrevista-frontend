import React, { useState } from 'react';
import api from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Importaciones de MUI
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

// Iconos
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

function RegisterForm() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    special: false
  });

  // Función para validar formato de email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Función para validar contraseña
  const validatePassword = (password) => {
    const validation = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };
    return validation;
  };

  // Función para verificar si la contraseña es válida
  const isPasswordValid = (validation) => {
    return Object.values(validation).every(Boolean);
  };

  // Función para manejar cambios en el email
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError('');
    setRegisterError('');
    
    if (value && !validateEmail(value)) {
      setEmailError('Por favor, ingresa un correo electrónico válido');
    }
  };

  // Función para manejar cambios en la contraseña
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setRegisterError('');
    
    const validation = validatePassword(value);
    setPasswordValidation(validation);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Validar email
    if (!validateEmail(email)) {
      setEmailError('Por favor, ingresa un correo electrónico válido');
      return;
    }
    
    // Validar contraseña
    const validation = validatePassword(password);
    if (!isPasswordValid(validation)) {
      setRegisterError('La contraseña no cumple con todos los requisitos de seguridad');
      return;
    }
    
    setLoading(true);
    setEmailError('');
    setRegisterError('');
    
    try {
      await api.post('/auth/register', {
        nombre,
        email,
        password,
      });
      toast.success('¡Registro exitoso! Por favor, inicia sesión.');
      navigate('/login');
    } catch (err) {
      const mensajeError = err.response?.data?.mensaje || err.response?.data?.message;
      
      if (err.response?.status === 409) {
        setRegisterError('Este correo electrónico ya está registrado. Intenta con otro.');
      } else {
        setRegisterError(mensajeError || 'Error en el registro. Inténtalo de nuevo.');
      }
      console.error('Error en el registro:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="nombre"
        label="Nombre Completo"
        name="nombre"
        autoComplete="name"
        autoFocus
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        disabled={loading}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PersonIcon sx={{ color: '#6c757d' }} />
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
        id="email"
        label="Correo Electrónico"
        name="email"
        autoComplete="email"
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
        autoComplete="new-password"
        value={password}
        onChange={handlePasswordChange}
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
        startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <PersonAddIcon />}
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
        {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
      </Button>

      {/* Indicador de requisitos de contraseña - siempre visible */}
      <Box sx={{ mt: 2, mb: 1 }}>
        <Typography variant="body2" sx={{ color: '#6c757d', mb: 1, fontSize: '0.875rem' }}>
          Requisitos de contraseña:
        </Typography>
        <List dense sx={{ py: 0 }}>
          <ListItem sx={{ py: 0.25, px: 0 }}>
            <ListItemIcon sx={{ minWidth: 28 }}>
              {passwordValidation.length ? (
                <CheckCircleIcon sx={{ fontSize: 16, color: '#4caf50' }} />
              ) : (
                <CancelIcon sx={{ fontSize: 16, color: password ? '#f44336' : '#9e9e9e' }} />
              )}
            </ListItemIcon>
            <ListItemText 
              primary="Al menos 8 caracteres" 
              primaryTypographyProps={{ 
                fontSize: '0.8rem',
                color: passwordValidation.length ? '#4caf50' : (password ? '#f44336' : '#9e9e9e')
              }} 
            />
          </ListItem>
          <ListItem sx={{ py: 0.25, px: 0 }}>
            <ListItemIcon sx={{ minWidth: 28 }}>
              {passwordValidation.lowercase ? (
                <CheckCircleIcon sx={{ fontSize: 16, color: '#4caf50' }} />
              ) : (
                <CancelIcon sx={{ fontSize: 16, color: password ? '#f44336' : '#9e9e9e' }} />
              )}
            </ListItemIcon>
            <ListItemText 
              primary="Al menos una letra minúscula" 
              primaryTypographyProps={{ 
                fontSize: '0.8rem',
                color: passwordValidation.lowercase ? '#4caf50' : (password ? '#f44336' : '#9e9e9e')
              }} 
            />
          </ListItem>
          <ListItem sx={{ py: 0.25, px: 0 }}>
            <ListItemIcon sx={{ minWidth: 28 }}>
              {passwordValidation.uppercase ? (
                <CheckCircleIcon sx={{ fontSize: 16, color: '#4caf50' }} />
              ) : (
                <CancelIcon sx={{ fontSize: 16, color: password ? '#f44336' : '#9e9e9e' }} />
              )}
            </ListItemIcon>
            <ListItemText 
              primary="Al menos una letra mayúscula" 
              primaryTypographyProps={{ 
                fontSize: '0.8rem',
                color: passwordValidation.uppercase ? '#4caf50' : (password ? '#f44336' : '#9e9e9e')
              }} 
            />
          </ListItem>
          <ListItem sx={{ py: 0.25, px: 0 }}>
            <ListItemIcon sx={{ minWidth: 28 }}>
              {passwordValidation.number ? (
                <CheckCircleIcon sx={{ fontSize: 16, color: '#4caf50' }} />
              ) : (
                <CancelIcon sx={{ fontSize: 16, color: password ? '#f44336' : '#9e9e9e' }} />
              )}
            </ListItemIcon>
            <ListItemText 
              primary="Al menos un número" 
              primaryTypographyProps={{ 
                fontSize: '0.8rem',
                color: passwordValidation.number ? '#4caf50' : (password ? '#f44336' : '#9e9e9e')
              }} 
            />
          </ListItem>
          <ListItem sx={{ py: 0.25, px: 0 }}>
            <ListItemIcon sx={{ minWidth: 28 }}>
              {passwordValidation.special ? (
                <CheckCircleIcon sx={{ fontSize: 16, color: '#4caf50' }} />
              ) : (
                <CancelIcon sx={{ fontSize: 16, color: password ? '#f44336' : '#9e9e9e' }} />
              )}
            </ListItemIcon>
            <ListItemText 
              primary="Al menos un carácter especial (!@#$%^&*)" 
              primaryTypographyProps={{ 
                fontSize: '0.8rem',
                color: passwordValidation.special ? '#4caf50' : (password ? '#f44336' : '#9e9e9e')
              }} 
            />
          </ListItem>
        </List>
      </Box>

      {/* Mensaje de error de registro */}
      {registerError && (
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
          {registerError}
        </Typography>
      )}
    </Box>
  );
}

export default RegisterForm;