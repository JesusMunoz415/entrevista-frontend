import React from 'react';
import { Box, Typography, Button, Alert, AlertTitle } from '@mui/material';
import { RefreshOutlined, BugReportOutlined } from '@mui/icons-material';

/**
 * Error Boundary para capturar errores en componentes React
 * Proporciona una UI de fallback cuando ocurren errores
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error) {
    // Actualiza el state para mostrar la UI de fallback
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Captura detalles del error
    const errorId = Date.now().toString(36) + Math.random().toString(36).substr(2);
    
    this.setState({
      error,
      errorInfo,
      errorId
    });

    // Log del error (en producción enviar a servicio de logging)
    console.error('Error capturado por ErrorBoundary:', {
      errorId,
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });

    // En producción, enviar a servicio de logging
    if (process.env.NODE_ENV === 'production') {
      this.logErrorToService({
        errorId,
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      });
    }
  }

  logErrorToService = (errorData) => {
    // Aquí se enviaría el error a un servicio como Sentry, LogRocket, etc.
    // Por ahora solo lo guardamos en localStorage para debugging
    try {
      const existingErrors = JSON.parse(localStorage.getItem('app_errors') || '[]');
      existingErrors.push(errorData);
      // Mantener solo los últimos 10 errores
      if (existingErrors.length > 10) {
        existingErrors.splice(0, existingErrors.length - 10);
      }
      localStorage.setItem('app_errors', JSON.stringify(existingErrors));
    } catch (e) {
      console.error('Error al guardar error en localStorage:', e);
    }
  };

  handleReload = () => {
    window.location.reload();
  };

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null 
    });
  };

  render() {
    if (this.state.hasError) {
      const { fallback: FallbackComponent } = this.props;
      
      // Si se proporciona un componente de fallback personalizado
      if (FallbackComponent) {
        return (
          <FallbackComponent
            error={this.state.error}
            errorInfo={this.state.errorInfo}
            errorId={this.state.errorId}
            onRetry={this.handleRetry}
            onReload={this.handleReload}
          />
        );
      }

      // UI de fallback por defecto
      return (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="400px"
          padding={3}
          textAlign="center"
        >
          <Alert severity="error" sx={{ width: '100%', maxWidth: 600, mb: 3 }}>
            <AlertTitle>
              <Box display="flex" alignItems="center" gap={1}>
                <BugReportOutlined />
                ¡Oops! Algo salió mal
              </Box>
            </AlertTitle>
            
            <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
              Ha ocurrido un error inesperado en la aplicación. 
              {this.state.errorId && (
                <>
                  <br />
                  <strong>ID del error:</strong> {this.state.errorId}
                </>
              )}
            </Typography>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                <Typography variant="caption" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                  {this.state.error.message}
                </Typography>
              </Box>
            )}

            <Box display="flex" gap={2} justifyContent="center" sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                onClick={this.handleRetry}
                startIcon={<RefreshOutlined />}
              >
                Reintentar
              </Button>
              
              <Button
                variant="contained"
                onClick={this.handleReload}
                startIcon={<RefreshOutlined />}
              >
                Recargar página
              </Button>
            </Box>
          </Alert>
        </Box>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook para usar ErrorBoundary de forma funcional
 */
export const withErrorBoundary = (Component, fallbackComponent) => {
  return function WrappedComponent(props) {
    return (
      <ErrorBoundary fallback={fallbackComponent}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
};

export default ErrorBoundary;