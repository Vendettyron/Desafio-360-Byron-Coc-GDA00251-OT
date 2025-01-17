import api from './api'; 

/**
 * Obtiene la lista de todas las categorías.
 * @returns {Promise<Array>} - Lista de categorías
 */
export const obtenerCategorias = async () => {
  try {
    const response = await api.get('/categorias/ObtenerCategorias');
    return response.data; 
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    throw error;
  }
};

/**
 * Obtiene la lista de categorías activas.
 * @returns {Promise<Array>} - Lista de categorías activas
 */

export const obtenerCategoriasActivas = async () => {
  try {
    const response = await api.get('/categorias/ObtenerCategoriasActivas');
    return response.data; 
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    throw error;
  }
};

/**
 * Obtiene una categoría por su ID.
 * @param {number|string} id - ID de la categoría
 * @returns {Promise<Object>} - Datos de la categoría
 */
export const obtenerCategoriaPorId = async (id) => {
  try {
    const response = await api.get(`/categorias/ObtenerCategoriasPorId/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener la categoría con ID ${id}:`, error);
    throw error;
  }
};

/**
 * Crea una nueva categoría.
 * @param {Object} data - Datos de la categoría { nombre, descripcion, fk_estado }
 * @returns {Promise<Object>} - Categoría creada
 */
export const crearCategoria = async (data) => {
  try {
    const response = await api.post('/categorias/CrearCategoria', data);
    return response.data;
  } catch (error) {
    console.error('Error al crear categoría:', error);
    throw error;
  }
};

/**
 * Actualiza una categoría existente.
 * @param {number|string} id - ID de la categoría a actualizar
 * @param {Object} data - Datos actualizados { nombre, descripcion, fk_estado }
 * @returns {Promise<Object>} - Categoría actualizada
 */
export const actualizarCategoria = async (id, data) => {
  try {
    const response = await api.put(`/categorias/ActualizarCategoria/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar la categoría con ID ${id}:`, error);
    throw error;
  }
};

/**
 * Activa una categoría.
 * @param {number|string} id - ID de la categoría a activar
 * @returns {Promise<Object>} - Categoría activada
 */
export const activarCategoria = async (id) => {
  try {
    const response = await api.put(`/categorias/ActivarCategoria/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al activar la categoría con ID ${id}:`, error);
    throw error;
  }
};

/**
 * Inactiva una categoría.
 * @param {number|string} id - ID de la categoría a inactivar
 * @returns {Promise<Object>} - Categoría inactivada
 */
export const inactivarCategoria = async (id) => {
  try {
    const response = await api.put(`/categorias/InactivarCategoria/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al inactivar la categoría con ID ${id}:`, error);
    throw error;
  }
};
