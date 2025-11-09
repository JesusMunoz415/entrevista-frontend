import axios from 'axios';
import toast from 'react-hot-toast';

/**
 * Configuración centralizada de Axios con interceptors
 * Maneja errores de forma consistente en toda la aplicación
 */

// Crear instancia de axios
const api = axios.create({
  baseURL: 'http://192.168.100.62:3001/api',
  timeout: 10000, // 10 segundos
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Para enviar cookies y headers de autenticación
});

// Contador de requests activos para loading global
let activeRequests = 0;
const loadingCallbacks = new Set();

// Funciones para manejar loading global
export const onLoadingChange = (callback) => {
  loadingCallbacks.add(callback);
  return () => loadingCallbacks.delete(callback);
};

const setLoading = (isLoading) => {
  loadingCallbacks.forEach(callback => callback(isLoading));
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Incrementar contador de requests activos
    activeRequests++;
    if (activeRequests === 1) {
      setLoading(true);
    }

    // Agregar token de autenticación si existe
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log de request en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, {
        data: config.data,
        params: config.params,
      });
    }

    return config;
  },
  (error) => {
    activeRequests--;
    if (activeRequests === 0) {
      setLoading(false);
    }
    
    console.error('Error en request interceptor:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Decrementar contador de requests activos
    activeRequests--;
    if (activeRequests === 0) {
      setLoading(false);
    }

    // Log de response exitoso en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      });
    }

    return response;
  },
  (error) => {
    // Decrementar contador de requests activos
    activeRequests--;
    if (activeRequests === 0) {
      setLoading(false);
    }

    // Log del error
    console.error('❌ Error en response interceptor:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
    });

    // Manejo específico de errores
    const status = error.response?.status;
    const errorData = error.response?.data;
    
    switch (status) {
      case 400:
        // Bad Request
        toast.error(errorData?.mensaje || 'Datos inválidos');
        break;
        
      case 401:
        // Unauthorized
        const errorCode = errorData?.code;
        
        if (errorCode === 'TOKEN_EXPIRED') {
          toast.error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
          // Limpiar token y redirigir al login
          localStorage.removeItem('token');
          window.location.href = '/login';
        } else if (errorCode === 'NO_TOKEN') {
          toast.error('Debes iniciar sesión para acceder a esta función');
          window.location.href = '/login';
        } else {
          toast.error(errorData?.mensaje || 'No autorizado');
        }
        break;
        
      case 403:
        // Forbidden
        toast.error('No tienes permisos para realizar esta acción');
        break;
        
      case 404:
        // Not Found
        toast.error('Recurso no encontrado');
        break;
        
      case 409:
        // Conflict
        toast.error(errorData?.mensaje || 'Conflicto en los datos');
        break;
        
      case 422:
        // Unprocessable Entity (errores de validación)
        if (errorData?.errors && Array.isArray(errorData.errors)) {
          errorData.errors.forEach(err => toast.error(err.msg || err.message));
        } else {
          toast.error(errorData?.mensaje || 'Error de validación');
        }
        break;
        
      case 429:
        // Too Many Requests
        toast.error('Demasiadas peticiones. Intenta más tarde.');
        break;
        
      case 500:
        // Internal Server Error
        toast.error('Error interno del servidor. Intenta más tarde.');
        break;
        
      case 502:
      case 503:
      case 504:
        // Server errors
        toast.error('El servidor no está disponible. Intenta más tarde.');
        break;
        
      default:
        // Network errors o otros errores
        if (error.code === 'NETWORK_ERROR' || !error.response) {
          toast.error('Error de conexión. Verifica tu internet.');
        } else if (error.code === 'ECONNABORTED') {
          toast.error('La petición tardó demasiado. Intenta nuevamente.');
        } else {
          toast.error(errorData?.mensaje || 'Ha ocurrido un error inesperado');
        }
    }

    // Logging de errores para análisis
    logError({
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
    });

    return Promise.reject(error);
  }
);

/**
 * Función para logging de errores
 * En producción se enviaría a un servicio de logging
 */
const logError = (errorData) => {
  try {
    // En desarrollo, solo log a consola
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', errorData);
    }

    // En producción, enviar a servicio de logging
    if (process.env.NODE_ENV === 'production') {
      // Guardar en localStorage para debugging (temporal)
      const existingErrors = JSON.parse(localStorage.getItem('api_errors') || '[]');
      existingErrors.push(errorData);
      
      // Mantener solo los últimos 20 errores
      if (existingErrors.length > 20) {
        existingErrors.splice(0, existingErrors.length - 20);
      }
      
      localStorage.setItem('api_errors', JSON.stringify(existingErrors));
      
      // Aquí se enviaría a servicio como Sentry, LogRocket, etc.
      // sendToLoggingService(errorData);
    }
  } catch (e) {
    console.error('Error al registrar error:', e);
  }
};

/**
 * Funciones de utilidad para requests comunes
 */
export const apiUtils = {
  // GET request con manejo de errores
  get: async (url, config = {}) => {
    try {
      const response = await api.get(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // POST request con manejo de errores
  post: async (url, data = {}, config = {}) => {
    try {
      const response = await api.post(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // PUT request con manejo de errores
  put: async (url, data = {}, config = {}) => {
    try {
      const response = await api.put(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // DELETE request con manejo de errores
  delete: async (url, config = {}) => {
    try {
      const response = await api.delete(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default api;