import api from './api'; 

/**
 * Crea un nuevo producto.
 * @param {Object} data - Datos del producto { fk_categoria, fk_estado, fk_proveedor, nombre, descripcion, precio, stock, fk_id_usuario }
 * @returns {Promise<Object>} - Producto creado
 */
export const crearProducto = async (data) => {
  try {
    const response = await api.post('/productos/CrearProducto', data);
    return response.data;
  } catch (error) {
    console.error('Error al crear producto:', error);
    throw error;
  }
};

/**
 * Obtiene la lista de todos los productos.
 * @returns {Promise<Array>} - Lista de productos
 */
export const obtenerProductos = async () => {
  try {
    const response = await api.get('/productos/ObtenerProductos');
    return response.data; 
  } catch (error) {
    console.error('Error al obtener productos:', error);
    throw error;
  }
};

/**
 * Obtiene un producto por su ID.
 * @param {number|string} id - ID del producto
 * @returns {Promise<Object>} - Datos del producto
 */
export const obtenerProductoPorId = async (id) => {
  try {
    const response = await api.get(`/productos/ObtenerProductosPorId/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el producto con ID ${id}:`, error);
    throw error;
  }
};

/**
 * Actualiza un producto existente.
 * @param {number|string} id - ID del producto a actualizar
 * @param {Object} data - Datos actualizados { fk_categoria, fk_estado, fk_proveedor, nombre, descripcion, precio, stock, fk_id_usuario }
 * @returns {Promise<Object>} - Producto actualizado
 */
export const actualizarProducto = async (id, data) => {
  try {
    const response = await api.put(`/productos/ActualizarProducto/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar el producto con ID ${id}:`, error);
    throw error;
  }
};

/**
 * Activa un producto existente.
 * @param {number|string} id - ID del producto a activar
 * @returns {Promise<Object>} - Producto activado
 */
export const activarProducto = async (id) => {
  try {
    const response = await api.put(`/productos/ActivarProducto/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al activar el producto con ID ${id}:`, error);
    throw error;
  }
};

/**
 * Inactiva un producto existente.
 * @param {number|string} id - ID del producto a inactivar
 * @returns {Promise<Object>} - Producto inactivado
 */
export const inactivarProducto = async (id) => {
  try {
    const response = await api.put(`/productos/InactivarProducto/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al inactivar el producto con ID ${id}:`, error);
    throw error;
  }
};

