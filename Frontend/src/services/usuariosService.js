import api from './api'; 

/**
 * Obtiene la lista de todos los usuarios.
 * @returns {Promise<Array>} - Lista de usuarios
 */
export const obtenerUsuarios = async () => {
  try {
    const response = await api.get('/usuarios/ObtenerUsuarios');
    return response.data; 
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error;
  }
};

/**
 * Obtiene un usuario por su ID.
 * @param {number|string} id - ID del usuario
 * @returns {Promise<Object>} - Datos del usuario
 */
export const obtenerUsuarioPorId = async (id) => {
  try {
    console.log(id);
    const response = await api.get(`/usuarios/ObtenerUsuarioPorId/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el usuario con ID ${id}:`, error);
    throw error;
  }
};

/**
 * Actualiza un usuario existente.
 * @param {number|string} id - ID del usuario a actualizar
 * @param {Object} data - Datos actualizados { nombre, apellido, direccion, correo, telefono, password, fk_rol, fk_estado }
 * @returns {Promise<Object>} - Usuario actualizado
 */
export const actualizarUsuario = async (id, data) => {
  try {
    const response = await api.put(`/usuarios/ActualizarUsuario/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar el usuario con ID ${id}:`, error);
    throw error;
  }
};

/**
 * Inactiva un usuario existente.
 * @param {number|string} id - ID del usuario a inactivar
 * @returns {Promise<Object>} - Usuario inactivado
 */
export const inactivarUsuario = async (id) => {
  try {
    const response = await api.put(`/usuarios/InactivarUsuario/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al inactivar el usuario con ID ${id}:`, error);
    throw error;
  }
};

/**
 * Activa un usuario existente.
 * @param {number|string} id - ID del usuario a activar
 * @returns {Promise<Object>} - Usuario activado
 */
export const activarUsuario = async (id) => {
  try {
    const response = await api.put(`/usuarios/ActivarUsuario/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al activar el usuario con ID ${id}:`, error);
    throw error;
  }
};

/**
 * Inactiva el usuario que realiza la petición.
 * @returns {Promise<Object>} - Usuario inactivado
 */

export const eliminarUsuarioElMismo = async (data) => {
  try {
    const response = await api.put(`/usuarios/InactivarUsuarioElMismo`,data);
    return response.data;
  } catch (error) {
    console.error(`Error al inactivar el usuario con ID ${id}:`, error);
    throw error;
  }
}

/**
 * Obtiene la lista de los detalles de un carrito de un usuario especifico.
 * @param {number|string} id - ID del usuario
 * @returns {Promise<Array>} - Lista de detalles del carrito
 */

export const obtenerDetallesCarritoPorUsuarioAdmin = async (id) => {
  try {
    const response = await api.get(`/carrito/ObtenerDetallesCarritoPorUsuarioAdmin/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener los detalles del carrito del usuario con ID ${id}:`, error);
    throw error;
  }
}

/**
 * Actualiza el Detalle del carrito de un usuario especifico.
 *  
 * @param {number|string} idUsuario - ID del usuario
 * @param {number|string} idProducto - ID del producto
 * @param {Object} data - Datos actualizados { nueva_cantidad }
 * @returns {Promise<Object>} - Detalle del carrito actualizado
 */

export const actualizarDetalleCarritoAdmin = async (idUsuario,idProducto,data) => {
  try {
    const response = await api.put(`/carrito/ActualizarDetalleCarritoAdmin/${idUsuario}/${idProducto}`,data);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar el detalle del carrito del usuario con ID ${idUsuario}:`, error);
    throw error;
  }
}

/**
 * Agregar un producto al carrito de un usuario especifico realziado por un admin.
 * 
 * @param {number|string} idUsuario - ID del usuario
 * @param {number|string} idProducto - ID del producto
 * 
 * @returns {Promise<Object>} - Detalle del carrito actualizado
 */

export const agregarProductoAlCarritoAdmin = async (idUsuario,idProducto,data) => {
  try {
    const response = await api.post(`/carrito/AgregarProductoAlCarritoAdmin/${idUsuario}/${idProducto}`,data);
    return response.data;
  } catch (error) {
    console.error(`Error al agregar el producto al carrito del usuario con ID ${idUsuario}:`, error);
    throw error;
  }
}


/**
 * Eliminar un detalle especifico del carrito de un usuario especifico.
 * 
 * @param {number|string} idUsuario - ID del usuario
 * @param {number|string} idProducto - ID del producto
 * 
 * @returns {Promise<Object>} - Detalle del carrito eliminado
 */

export const eliminarDetalleCarritoAdmin = async (idUsuario,idProducto) => {
  try {
    const response = await api.delete(`/carrito/EliminarDetalleCarritoAdmin/${idUsuario}/${idProducto}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar el detalle del carrito del usuario con ID ${idUsuario}:`, error);
    throw error;
  }
}

/**
 * Eliminar todos los detalles del carrito de un usuario especifico.
 * 
 * @param {number|string} id - ID del usuario
 * 
 * @returns {Promise<Object>} - Detalles del carrito eliminados
 */

export const eliminarDetallesCarritoAdmin = async (id) => {
  try {
    const response = await api.delete(`/carrito/EliminarDetallesCarritoAdmin/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar los detalles del carrito del usuario con ID ${id}:`, error);
    throw error;
  }
}


