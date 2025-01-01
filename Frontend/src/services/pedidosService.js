import api from './api'; 

/**
 * Obtiene todos los pedidos para Admin.
 * @returns {Promise<Array>} - Lista de pedidos.
 */
export const obtenerPedidos = async () => {
    try {
        const response = await api.get('/pedido/ObtenerPedidos');
        return response.data;
    } catch (error) {
        console.error('Error al obtener pedidos:', error);
        throw error;
    }
};

/**
 * Obtiene los pedidos realizados por un cliente específico.
 * @param {number|string} idcliente - ID del cliente.
 * @param {number|string} idpedido - ID del pedido
 * @returns {Promise<Array>} - Lista de pedidos del cliente.
 */
export const obtenerPedidosClientePorAdmin = async (id) => {
    try {
        const response = await api.get(`/pedido/obtenerDetallesClientePorAdmin/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener pedidos del cliente ${idcliente}:`, error);
        throw error;
    }
};

/**
 * Obtiene los detalles de un pedido de un cliente específico.
 * @param {number|string} id - ID del cliente
 * @param {Object} data - id del pedido
 * @returns {Promise<Object>} - Detalles del pedido.
 */
export const obtenerDetallesClientePorAdmin = async (idcliente, idpedido) => {
    try {
        console.log(idcliente, idpedido);
        const response = await api.get(`/pedido/obtenerDetallesClientePorAdmin/${idcliente}/${idpedido}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener detalles del pedido ${idpedido} para el cliente ${idcliente}:`, error);
        throw error;
    }
};

/**
 * Aprueba un pedido como Admin.
 * @param {number|string} id - ID del pedido a aprobar.
 * @returns {Promise<Object>} - Pedido aprobado.
 */
export const aprobarPedido = async (id) => {
    try {
        const response = await api.put(`/pedido/AprobarPedido/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error al aprobar el pedido ${id}:`, error);
        throw error;
    }
};

/**
 * Cancela un pedido como administrador.
 * @param {number|string} id - ID del pedido a cancelar.
 * @returns {Promise<Object>} - Pedido cancelado.
 */
export const cancelarPedido = async (id) => {
    try {
        const response = await api.put(`/pedido/CancelarPedidoAdmin/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error al cancelar el pedido ${id}:`, error);
        throw error;
    }
};


/**
 * Obtiene un pedido específico por su ID.
 * @param {number|string} id - ID del pedido
 * @returns {Promise<Object>} - data del pedido.
 */

export const obtenerPedidoPorId = async (id) => {
    try {
        const response = await api.get(`/pedido/obtenerPedidoPorId/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener pedido ${id}:`, error);
        throw error;
    }
};
