import api from '../utils/axiosConfig';

/**
 * Servicio para manejar operaciones relacionadas con estadísticas
 */
export const estadisticasService = {
  /**
   * Obtener estadísticas del dashboard
   */
  obtenerEstadisticasDashboard: async () => {
    try {
      const response = await api.get('/estadisticas/dashboard');
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas del dashboard:', error);
      throw error;
    }
  },

  /**
   * Obtener entrevistas pendientes de evaluación
   */
  obtenerEntrevistasPendientes: async () => {
    try {
      const response = await api.get('/estadisticas/pendientes');
      return response.data;
    } catch (error) {
      console.error('Error al obtener entrevistas pendientes:', error);
      throw error;
    }
  },

  /**
   * Obtener puntajes por módulo de una entrevista específica
   * @param {number} entrevistaId - ID de la entrevista
   * @returns {Promise<Object>} Puntajes por módulo
   */
  obtenerPuntajesPorModulo: async (entrevistaId) => {
    try {
      const response = await api.get(`/estadisticas/entrevista/${entrevistaId}/modulos`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener puntajes por módulo:', error);
      throw error;
    }
  }
};

export default estadisticasService;