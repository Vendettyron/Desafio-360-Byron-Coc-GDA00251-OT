import { poolPromise, sql } from '../database/DbConection.js';

const obtenerPedidosCliente = async (fk_cliente) => {
    try{
        const pool = await poolPromise;
        const result = await pool.request()
            .input('fk_cliente', sql.Int, fk_cliente)
            .execute('ObtenerPedidosCliente');
        return result.recordset;
    } catch (error) {
        throw error;
    }   
};


const obtenerDetallesPedidoCliente = async (data) => {
    const {fk_id_usuario, pk_id_pedido} = data;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('fk_id_usuario', sql.Int, fk_id_usuario)
            .input('pk_id_pedido', sql.Int, pk_id_pedido)
            .execute('ObtenerDetallesPedido');
        return result.recordset;
    } catch (error) {
        throw error;
    }
};

/**
 * Actualizar un detalle en el pedido del usuario o eliminarlo si la nueva cantidad es 0
 */
const actualizarDetallePedido = async (data) => {
    const {fk_id_usuario,fk_id_pedido, fk_id_producto, nueva_cantidad} =data;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('fk_id_usuario', sql.Int, fk_id_usuario)
            .input('fk_id_pedido', sql.Int, fk_id_pedido)
            .input('fk_id_producto', sql.Int, fk_id_producto)
            .input('nueva_cantidad', sql.Int, nueva_cantidad)
            .execute('ActualizarDetallePedido');
    } catch (error) {
        throw error;
    }
};

/**
 * Cancelar el pedido en estado "En proceso" del cliente
 */
const cancelarPedidoCliente = async (data) => {
    const {fk_id_cliente, fk_id_pedido} = data;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('fk_id_cliente', sql.Int, fk_id_cliente)
            .input('fk_id_pedido', sql.Int, fk_id_pedido)
            .execute('CancelarPedidoCliente');
    } catch (error) {
        throw error;
    }
};

/**
 * Aprobar un pedido (admin)
 */
const aprobarPedido = async (data) => {
    const {pk_id_pedido,fk_id_usuario_operacion} = data;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('pk_id_pedido', sql.Int, pk_id_pedido)
            .input('fk_id_usuario_operacion', sql.Int, fk_id_usuario_operacion)
            .execute('AprobarPedido');
    } catch (error) {
        throw error;
    }
};

/**
 * Cancelar un pedido como administrador
 */
const cancelarPedidoAdministrador = async (data) => {
    const {pk_id_pedido, fk_id_usuario_operacion} = data;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('pk_id_pedido', sql.Int, pk_id_pedido)
            .input('fk_id_usuario_operacion', sql.Int, fk_id_usuario_operacion)
            .execute('CancelarPedidoAdministrador');
    } catch (error) {
        throw error;
    }
};

/**
 * Eliminar un detalle en el pedido del usuario
 */
const eliminarDetallePedido = async (data) => {
    const {fk_id_usuario,fk_id_pedido, fk_id_producto} = data;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('fk_id_usuario', sql.Int, fk_id_usuario)
            .input('fk_id_pedido', sql.Int, fk_id_pedido)
            .input('fk_id_producto', sql.Int, fk_id_producto)
            .execute('EliminarDetallePedido');
    } catch (error) {
        throw error;
    }
};

/**
 * Insertar un detalle en el pedido del usuario
 */
const insertarDetallePedido = async (data) => {
    const {fk_id_usuario,fk_id_pedido, fk_id_producto, cantidad} = data;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('fk_id_usuario', sql.Int, fk_id_usuario)
            .input('fk_id_pedido', sql.Int, fk_id_pedido)
            .input('fk_id_producto', sql.Int, fk_id_producto)
            .input('cantidad', sql.Int, cantidad)
            .execute('InsertarDetallePedido');
    } catch (error) {
        throw error;
    }
};

export default {
    actualizarDetallePedido,
    cancelarPedidoCliente,
    aprobarPedido,
    cancelarPedidoAdministrador,
    eliminarDetallePedido,
    insertarDetallePedido,
    obtenerDetallesPedidoCliente,
    obtenerPedidosCliente
};
