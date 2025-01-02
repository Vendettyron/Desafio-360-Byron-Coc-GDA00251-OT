import api from '@/services/api';

// Agregar un producto al carrito
export const agregarProductoAlCarrito = async (id, cantidad) => {
  try {
    const response = await api.post(`/carrito/AgregarProductoAlCarrito/${id}`, {
      cantidad,
    });
    return response.data;
  } catch (error) {
    console.error(`Error al agregar el producto con ID ${id} al carrito:`, error);
    throw error;
  }
};

// Obtener la lista de detalles (productos) del carrito

export const obtenerDetallesCarritoPorUsuario = async () => {
  try {
    const response = await api.get('/carrito/ObtenerDetallesCarritoPorUsuario');
    return response.data;
  } catch (error) {
    console.error('Error al obtener los detalles del carrito:', error);
    throw error;
  }
}

// Actualizar la cantidad de un producto en el carrito

export const actualizarDetalleCarrito = async (id, nueva_cantidad) => {
  try {
    const response = await api.put(`/carrito/ActualizarDetalleCarrito/${id}`, {
      nueva_cantidad
    });

    if (response.status === 204) {
      return null; 
    }

    return response.data;
  } catch (error) {
    console.error(`Error al actualizar el detalle del carrito con ID ${id}:`, error);
    throw error;
  }
}

// Elimina un producto del carrito

export const eliminarDetalleCarrito = async (id) => {
  try {
    const response = await api.delete(`/carrito/EliminarDetalleCarrito/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar el detalle del carrito con ID ${id}:`, error);
    throw error;
  }
}

// Elimina todos los detalles del carrito (vaciar carrito)

export const eliminarDetallesCarrito = async () => {
  try {
    const response = await api.delete('/carrito/EliminarDetallesCarrito');
    return response.data;
  } catch (error) {
    console.error('Error al eliminar los detalles del carrito:', error);
    throw error;
  }
}

// Confirmar el carrito para que se vuelva un pedido

export const confirmarCarrito = async () => {
  try {
    const response = await api.put('/carrito/ConfirmarCarrito');

    if (response.status === 204) {
      return null; 
    }
    return response.data;
  } catch (error) {
    console.error('Error al confirmar el carrito:', error);
    throw error;
  }
}