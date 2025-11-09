const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Servicio para operaciones relacionadas con el usuario
 */
class UserService {
  /**
   * Elimina la imagen de perfil del usuario
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async removeProfileImage() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/usuarios/remove-profile-image`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders(),
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar la imagen');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en removeProfileImage:', error);
      throw error;
    }
  }

  /**
   * Obtiene el token de autenticación del localStorage
   */
  getAuthToken() {
    return localStorage.getItem('token');
  }

  /**
   * Obtiene los headers de autenticación
   */
  getAuthHeaders() {
    const token = this.getAuthToken();
    return {
      'Authorization': `Bearer ${token}`,
    };
  }

  /**
   * Sube una imagen de perfil
   * @param {File} imageFile - Archivo de imagen a subir
   * @returns {Promise<Object>} Respuesta del servidor con la URL de la imagen
   */
  async uploadProfileImage(imageFile) {
    try {
      const formData = new FormData();
      formData.append('profileImage', imageFile);

      const response = await fetch(`${API_BASE_URL}/api/usuarios/upload-profile-image`, {
        method: 'POST',
        headers: {
          ...this.getAuthHeaders(),
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al subir la imagen');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en uploadProfileImage:', error);
      throw error;
    }
  }

  /**
   * Obtiene el perfil del usuario actual
   * @returns {Promise<Object>} Datos del perfil del usuario
   */
  async getUserProfile() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/usuarios/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders(),
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener el perfil');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en getUserProfile:', error);
      throw error;
    }
  }

  /**
   * Construye la URL completa para una imagen de perfil
   * @param {string} imagePath - Ruta relativa de la imagen
   * @returns {string} URL completa de la imagen
   */
  getImageUrl(imagePath) {
    if (!imagePath) return null;
    
    // Si ya es una URL completa, devolverla tal como está
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Construir URL completa para imágenes del servidor
    return `${API_BASE_URL}${imagePath}`;
  }
}

export default new UserService();