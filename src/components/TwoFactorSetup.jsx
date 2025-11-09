import React, { useState, useEffect } from 'react';
import api from '../utils/axiosConfig';
import toast from 'react-hot-toast';

// Importaciones de MUI
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Divider
} from '@mui/material';

// Iconos
import SecurityIcon from '@mui/icons-material/Security';
import QrCodeIcon from '@mui/icons-material/QrCode';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import BackupIcon from '@mui/icons-material/Backup';

const TwoFactorSetup = ({ onConfigurationChange }) => {
  const [status, setStatus] = useState({ enabled: false, setupDate: null });
  const [loading, setLoading] = useState(true);
  const [setupStep, setSetupStep] = useState(0);
  const [qrCode, setQrCode] = useState('');
  const [manualKey, setManualKey] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState([]);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [isEnabling, setIsEnabling] = useState(false);
  const [isDisabling, setIsDisabling] = useState(false);
  
  // Estados para los diálogos de confirmación
  const [showDisableDialog, setShowDisableDialog] = useState(false);
  const [showRegenerateDialog, setShowRegenerateDialog] = useState(false);
  const [disablePassword, setDisablePassword] = useState('');
  const [disableToken, setDisableToken] = useState('');
  const [regenerateToken, setRegenerateToken] = useState('');

  const steps = [
    'Generar código QR',
    'Configurar aplicación',
    'Verificar código',
    'Guardar códigos de respaldo'
  ];

  useEffect(() => {
    fetchTwoFactorStatus();
  }, []);

  // Notificar cambios en el estado de configuración
  useEffect(() => {
    if (onConfigurationChange) {
      onConfigurationChange(setupStep > 0);
    }
  }, [setupStep, onConfigurationChange]);

  const fetchTwoFactorStatus = async () => {
    try {
      const response = await api.get('/2fa/status');
      setStatus(response.data);
    } catch (error) {
      console.error('Error obteniendo estado 2FA:', error);
      toast.error('Error al obtener el estado de 2FA');
    } finally {
      setLoading(false);
    }
  };

  const generateSecret = async () => {
    try {
      setIsEnabling(true);
      const response = await api.post('/2fa/generate');
      setQrCode(response.data.qrCode);
      setManualKey(response.data.manualEntryKey);
      setSetupStep(1);
      toast.success('Código QR generado exitosamente');
    } catch (error) {
      console.error('Error generando secreto:', error);
      toast.error(error.response?.data?.mensaje || 'Error al generar código QR');
    } finally {
      setIsEnabling(false);
    }
  };

  const enableTwoFactor = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error('Por favor, ingresa un código de 6 dígitos');
      return;
    }

    try {
      setIsEnabling(true);
      const response = await api.post('/2fa/enable', {
        token: verificationCode
      });
      
      setBackupCodes(response.data.backupCodes);
      setStatus({ enabled: true, setupDate: new Date().toISOString() });
      setSetupStep(3);
      toast.success('2FA habilitado exitosamente');
    } catch (error) {
      console.error('Error habilitando 2FA:', error);
      toast.error(error.response?.data?.mensaje || 'Error al habilitar 2FA');
    } finally {
      setIsEnabling(false);
    }
  };

  const disableTwoFactor = async () => {
    try {
      setIsDisabling(true);
      await api.post('/2fa/disable', {
        password: disablePassword,
        token: disableToken
      });
      setStatus({ enabled: false, setupDate: null });
      setSetupStep(0);
      setQrCode('');
      setManualKey('');
      setVerificationCode('');
      setBackupCodes([]);
      setShowDisableDialog(false);
      setDisablePassword('');
      setDisableToken('');
      toast.success('2FA deshabilitado exitosamente');
    } catch (error) {
      console.error('Error deshabilitando 2FA:', error);
      toast.error(error.response?.data?.mensaje || 'Error al deshabilitar 2FA');
    } finally {
      setIsDisabling(false);
    }
  };

  const regenerateBackupCodes = async () => {
    try {
      const response = await api.post('/2fa/regenerate-backup-codes', {
        token: regenerateToken
      });
      setBackupCodes(response.data.backupCodes);
      setShowBackupCodes(true);
      setShowRegenerateDialog(false);
      setRegenerateToken('');
      toast.success('Códigos de respaldo regenerados');
    } catch (error) {
      console.error('Error regenerando códigos:', error);
      toast.error(error.response?.data?.mensaje || 'Error al regenerar códigos de respaldo');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado al portapapeles');
  };

  const downloadBackupCodes = () => {
    const content = `Códigos de respaldo 2FA - ProfileAnalytics
Fecha: ${new Date().toLocaleDateString()}

IMPORTANTE: Guarda estos códigos en un lugar seguro. Cada código solo puede usarse una vez.

${backupCodes.map((code, index) => `${index + 1}. ${code}`).join('\n')}

Instrucciones:
- Usa estos códigos si no puedes acceder a tu aplicación de autenticación
- Cada código solo funciona una vez
- Regenera nuevos códigos después de usar varios
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-codes-2fa-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <SecurityIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h5" component="h2">
            Autenticación de Dos Factores (2FA)
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" mb={3}>
          Agrega una capa extra de seguridad a tu cuenta requiriendo un código de tu teléfono además de tu contraseña.
        </Typography>

        {status.enabled ? (
          <Box>
            <Alert severity="success" sx={{ mb: 3 }}>
              <Typography variant="body2">
                2FA está habilitado desde {new Date(status.setupDate).toLocaleDateString()}
              </Typography>
            </Alert>

            <Box display="flex" gap={2} flexWrap="wrap">
              <Button
                variant="outlined"
                startIcon={<BackupIcon />}
                onClick={() => setShowBackupCodes(true)}
              >
                Ver códigos de respaldo
              </Button>
              
              <Button
                variant="outlined"
                onClick={() => setShowRegenerateDialog(true)}
              >
                Regenerar códigos
              </Button>

              <Button
                variant="contained"
                color="error"
                onClick={() => setShowDisableDialog(true)}
                disabled={isDisabling}
              >
                Deshabilitar 2FA
              </Button>
            </Box>
          </Box>
        ) : (
          <Box>
            <Alert severity="warning" sx={{ mb: 3 }}>
              2FA no está habilitado. Tu cuenta es más vulnerable sin esta protección adicional.
            </Alert>

            {setupStep === 0 && (
              <Button
                variant="contained"
                startIcon={<SecurityIcon />}
                onClick={generateSecret}
                disabled={isEnabling}
                size="large"
              >
                {isEnabling ? 'Generando...' : 'Configurar 2FA'}
              </Button>
            )}

            {setupStep > 0 && (
              <Box>
                <Stepper activeStep={setupStep - 1} sx={{ mb: 4 }}>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>

                {setupStep === 1 && (
                  <Box textAlign="center">
                    <Typography variant="h6" mb={2}>
                      Escanea el código QR
                    </Typography>
                    
                    <Box mb={3}>
                      <img 
                        src={qrCode} 
                        alt="Código QR para 2FA" 
                        style={{ maxWidth: '200px', height: 'auto' }}
                      />
                    </Box>

                    <Typography variant="body2" mb={2}>
                      O ingresa manualmente esta clave en tu aplicación:
                    </Typography>
                    
                    <Box display="flex" alignItems="center" justifyContent="center" gap={1} mb={3}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontFamily: 'monospace', 
                          backgroundColor: 'grey.100', 
                          p: 1, 
                          borderRadius: 1 
                        }}
                      >
                        {manualKey}
                      </Typography>
                      <Button size="small" onClick={() => copyToClipboard(manualKey)}>
                        Copiar
                      </Button>
                    </Box>

                    <Typography variant="body2" color="text.secondary" mb={3}>
                      Aplicaciones recomendadas: Google Authenticator, Authy, Microsoft Authenticator
                    </Typography>

                    <Button
                      variant="contained"
                      onClick={() => setSetupStep(2)}
                      startIcon={<PhoneAndroidIcon />}
                    >
                      Ya configuré mi aplicación
                    </Button>
                  </Box>
                )}

                {setupStep === 2 && (
                  <Box textAlign="center">
                    <Typography variant="h6" mb={2}>
                      Verifica tu configuración
                    </Typography>
                    
                    <Typography variant="body2" mb={3}>
                      Ingresa el código de 6 dígitos que aparece en tu aplicación de autenticación:
                    </Typography>

                    <TextField
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="123456"
                      inputProps={{ 
                        style: { textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5rem' },
                        maxLength: 6
                      }}
                      sx={{ mb: 3, '& input': { fontFamily: 'monospace' } }}
                    />

                    <Box display="flex" gap={2} justifyContent="center">
                      <Button
                        variant="outlined"
                        onClick={() => setSetupStep(1)}
                      >
                        Volver
                      </Button>
                      
                      <Button
                        variant="contained"
                        onClick={enableTwoFactor}
                        disabled={isEnabling || verificationCode.length !== 6}
                        startIcon={isEnabling ? <CircularProgress size={20} /> : <VerifiedUserIcon />}
                      >
                        {isEnabling ? 'Verificando...' : 'Verificar y habilitar'}
                      </Button>
                    </Box>
                  </Box>
                )}

                {setupStep === 3 && (
                  <Box textAlign="center">
                    <Alert severity="success" sx={{ mb: 3 }}>
                      <Typography variant="h6" mb={1}>
                        ¡2FA habilitado exitosamente!
                      </Typography>
                      <Typography variant="body2">
                        Tu cuenta ahora está protegida con autenticación de dos factores.
                      </Typography>
                    </Alert>

                    <Typography variant="h6" mb={2}>
                      Códigos de respaldo
                    </Typography>
                    
                    <Alert severity="warning" sx={{ mb: 3 }}>
                      <Typography variant="body2">
                        Guarda estos códigos en un lugar seguro. Los necesitarás si pierdes acceso a tu dispositivo de autenticación.
                      </Typography>
                    </Alert>

                    <Box display="flex" flexWrap="wrap" gap={1} justifyContent="center" mb={3}>
                      {backupCodes.map((code, index) => (
                        <Chip
                          key={index}
                          label={code}
                          variant="outlined"
                          sx={{ fontFamily: 'monospace' }}
                        />
                      ))}
                    </Box>

                    <Box display="flex" gap={2} justifyContent="center">
                      <Button
                        variant="outlined"
                        onClick={downloadBackupCodes}
                        startIcon={<BackupIcon />}
                      >
                        Descargar códigos
                      </Button>
                      
                      <Button
                        variant="contained"
                        onClick={() => {
                          setSetupStep(0);
                          setQrCode('');
                          setManualKey('');
                          setVerificationCode('');
                        }}
                      >
                        Finalizar
                      </Button>
                    </Box>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        )}

        {/* Dialog para deshabilitar 2FA */}
        <Dialog
          open={showDisableDialog}
          onClose={() => {
            setShowDisableDialog(false);
            setDisablePassword('');
            setDisableToken('');
          }}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Deshabilitar 2FA
          </DialogTitle>
          <DialogContent>
            <Alert severity="warning" sx={{ mb: 3 }}>
              Deshabilitar 2FA reducirá la seguridad de tu cuenta. Necesitas confirmar tu identidad.
            </Alert>
            
            <TextField
              fullWidth
              type="password"
              label="Contraseña actual"
              value={disablePassword}
              onChange={(e) => setDisablePassword(e.target.value)}
              sx={{ mb: 2 }}
              required
            />
            
            <TextField
              fullWidth
              label="Código 2FA (6 dígitos)"
              value={disableToken}
              onChange={(e) => setDisableToken(e.target.value)}
              inputProps={{ maxLength: 6 }}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => {
                setShowDisableDialog(false);
                setDisablePassword('');
                setDisableToken('');
              }}
            >
              Cancelar
            </Button>
            <Button 
              onClick={disableTwoFactor}
              color="error"
              variant="contained"
              disabled={!disablePassword || disableToken.length !== 6 || isDisabling}
              startIcon={isDisabling ? <CircularProgress size={20} /> : null}
            >
              {isDisabling ? 'Deshabilitando...' : 'Deshabilitar 2FA'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog para regenerar códigos de respaldo */}
        <Dialog
          open={showRegenerateDialog}
          onClose={() => {
            setShowRegenerateDialog(false);
            setRegenerateToken('');
          }}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Regenerar códigos de respaldo
          </DialogTitle>
          <DialogContent>
            <Alert severity="info" sx={{ mb: 3 }}>
              Los códigos actuales dejarán de funcionar. Confirma tu identidad para generar nuevos códigos.
            </Alert>
            
            <TextField
              fullWidth
              label="Código 2FA (6 dígitos)"
              value={regenerateToken}
              onChange={(e) => setRegenerateToken(e.target.value)}
              inputProps={{ maxLength: 6 }}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => {
                setShowRegenerateDialog(false);
                setRegenerateToken('');
              }}
            >
              Cancelar
            </Button>
            <Button 
              onClick={regenerateBackupCodes}
              variant="contained"
              disabled={regenerateToken.length !== 6}
            >
              Regenerar códigos
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog para mostrar códigos de respaldo */}
        <Dialog
          open={showBackupCodes}
          onClose={() => setShowBackupCodes(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Box display="flex" alignItems="center">
              <BackupIcon sx={{ mr: 1 }} />
              Códigos de respaldo 2FA
            </Box>
          </DialogTitle>
          <DialogContent>
            <Alert severity="info" sx={{ mb: 2 }}>
              Cada código solo puede usarse una vez. Guárdalos en un lugar seguro.
            </Alert>
            
            <Box display="flex" flexWrap="wrap" gap={1}>
              {backupCodes.map((code, index) => (
                <Chip
                  key={index}
                  label={code}
                  variant="outlined"
                  sx={{ fontFamily: 'monospace' }}
                  onClick={() => copyToClipboard(code)}
                />
              ))}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={downloadBackupCodes} startIcon={<BackupIcon />}>
              Descargar
            </Button>
            <Button onClick={() => setShowBackupCodes(false)}>
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default TwoFactorSetup;