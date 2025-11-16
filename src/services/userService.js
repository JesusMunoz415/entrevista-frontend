// frontend/src/services/userService.js
// --- VERSIÓN CORREGIDA Y REFACTORIZADA ---

import api from '../utils/axiosConfig'; // Asegúrate que esta ruta a tu axiosConfig sea correcta

/**
 * Servicio para operaciones relacionadas con el usuario
 * (Refactorizado para usar la instancia global de Axios)
 */
class UserService {
  /**
   * Elimina la imagen de perfil del usuario
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async removeProfileImage() {
    // El interceptor de 'api' ya maneja el token y los errores con toast
    const response = await api.delete('/usuarios/remove-profile-image');
    return response.data;
  }

  /**
   * Sube una imagen de perfil
   * @param {File} imageFile - Archivo de imagen a subir
   * @returns {Promise<Object>} Respuesta del servidor con la URL de la imagen
   */
  async uploadProfileImage(imageFile) {
    const formData = new FormData();
    formData.append('profileImage', imageFile);

    // Axios detectará FormData y ajustará el Content-Type automáticamente
    // El token y el error se manejan en el interceptor
    const response = await api.post('/usuarios/upload-profile-image', formData);
    return response.data;
  }

  /**
   * Obtiene el perfil del usuario actual
   * @returns {Promise<Object>} Datos del perfil del usuario
   */
  async getUserProfile() {
    // El interceptor de 'api' ya maneja el token y los errores con toast
    const response = await api.get('/usuarios/profile');
    return response.data;
  }

  /**
   * Construye la URL completa para una imagen de perfil
   * @param {string} imagePath - Ruta relativa de la imagen
   * @returns {string} URL completa de la imagen
   */
  getImageUrl(imagePath) {
    if (!imagePath) return null;
    
    // Si ya es una URL completa (ej. de un CDN), devolverla tal como está
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Para imágenes servidas por nuestro backend, construimos la URL.
    // Asumimos que VITE_API_URL es 'https://.../api' y las imágenes
    // se sirven desde la raíz del backend (ej. '/uploads/img.png').
    // Por lo tanto, quitamos el '/api' del baseURL.
    const baseUrl = import.meta.env.VITE_API_URL.replace('/api', '');
    
    // Asegurarse de que la ruta de la imagen comience con un '/'
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;

    return `${baseUrl}${cleanPath}`;
  }
}

// Exportamos una instancia única del servicio (Singleton pattern)
export default new UserService();