import api from './api';

/**
 * Obtener todos los proveedores.
 * @returns {Promise<Array>} - Lista de proveedores.
 */
export const getProveedores = async () => {
  try {
    const response = await api.get('/proveedor/ObtenerProveedor');
    return response.data; 
  } catch (error) {
    console.error('Error al obtener proveedores:', error);
    throw error;
  }
};

/**
 * Activar un proveedor.
 * @param {number} id - ID del proveedor a activar.
 */
export const activarProveedor = async (id) => {
  try {
    const response = await api.put(`/proveedor/ActivarProveedor/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al activar proveedor:', error);
    throw error;
  }
};

/**
 * Inactivar un proveedor.
 * @param {number} id - ID del proveedor a inactivar.
 */
export const inactivarProveedor = async (id) => {
  try {
    const response = await api.put(`/proveedor/InactivarProveedor/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al inactivar proveedor:', error);
    throw error;
  }
};

/**
 * Actualizar Proveedor.
 * @param {Object} data - Datos del proveedor a actualizar.
 */
export const actualizarProveedor = async (data) => {
  try {
    const { pk_id_proveedor } = data;
    const response = await api.put(`/proveedor/ActualizarProveedor/${pk_id_proveedor}`, data);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar proveedor:', error);
    throw error;
  }
};

/**
 * Obtener Proveedor por ID.
 * @param {number} id - id del proveedor a obtener.
 */
export const obtenerProveedorPorId = async (id) => {
  try {
    const response = await api.get(`/proveedor/ObtenerProveedorPorId/${id}`);
    return response.data; 
  } catch (error) {
    console.error('Error al obtener proveedor por ID:', error);
    throw error;
  }
};


/**
 * Obtener Proveedores activos.
 * @param {Object} data - id del proveedor a obtener.
 */
export const getProveedoresActivos = async () => {
  try {
    const response = await api.get('/proveedor/ObtenerProveedoresActivos');
    return response.data; 
  } catch (error) {
    console.error('Error al obtener proveedores activos:', error);
    throw error;
  }
};

/**
 * Crear Proveedor Nuevo.
 */

export const crearProveedor = async (data) => {
  try {
    const response = await api.post('/proveedor/CrearProveedor', data);
    return response.data;
  } catch (error) {
    console.error('Error al crear proveedor:', error);
    throw error;
  }
}