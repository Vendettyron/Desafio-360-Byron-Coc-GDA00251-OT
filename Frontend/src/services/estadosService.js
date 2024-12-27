import api from './api';

/**
 * Obtiene la lista de todos los estados.
 * @returns {Promise<Array>} - Lista de estados
 */
export const obtenerEstados = async () => {
  try {
    const response = await api.get('/estados/ObtenerEstados');
    return response.data; 
  } catch (error) {
    console.error('Error al obtener estados:', error);
    throw error;
  }
};

/**
 * Crea un nuevo estado.
 * @param {Object} data - Datos del estado { nombre, descripcion, fk_estado }
 * @returns {Promise<Object>} - Estado creado
 */
export const crearEstado = async (data) => {
  try {
    const response = await api.post('/estados/CrearEstado', data);
    return response.data;
  } catch (error) {
    console.error('Error al crear estado:', error);
    throw error;
  }
};

/**
 * Actualiza un estado existente.
 * @param {number|string} id - ID del estado a actualizar
 * @param {Object} data - Datos actualizados { nombre, descripcion, fk_estado }
 * @returns {Promise<Object>} - Estado actualizado
 */
export const actualizarEstado = async (id, data) => {
  try {
    const response = await api.put(`/estados/ActualizarEstado/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar el estado con ID ${id}:`, error);
    throw error;
  }
};

/**
  * Obtiene un estado por su ID.
  * @param {number|string} id - ID del estado a obtener
  * @returns {Promise<Object>} - Estado encontrado
 */

export const obtenerEstadoPorId = async (id,data) =>{
  try{
    const response = await api.get(`/estados/ObtenerEstadoPorId/${id}`,data);
    return response.data;
  }catch(error){
    console.error(`Error al obtener el estado con ID ${id}:`, error);
    throw error;
  } 
};

