import { poolPromise,sql} from '../database/DbConection.js';

const obtenerDetallesCarritoPorUsuario = async (fk_id_usuario) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('fk_id_usuario',sql.Int, fk_id_usuario)
            .execute('ObtenerDetallesCarritoPorUsuario'); // Llamar al SP ObtenerDetallesCarritoPorUsuario
        return result.recordset;
    } catch (error) {
        console.error('Error obteniendo detalles del carrito:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
}

const AgregarProductoAlCarrito = async (data) => {
    const { fk_id_usuario, pk_id_producto, cantidad } = data;

    try {
        const pool = await poolPromise;
        await pool.request()
            .input('fk_id_usuario',sql.Int, fk_id_usuario)
            .input('pk_id_producto',sql.Int, pk_id_producto)
            .input('cantidad',sql.Int ,cantidad)
            .execute('AgregarProductoAlCarrito'); // Llamar al SP AgregarProductoAlCarrito
    } catch (error) {
        throw error;
    }
};

const EliminarDetalleCarrito = async (data) => {
    const { fk_id_producto, fk_id_usuario } = data;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('fk_id_usuario',sql.Int, fk_id_usuario)
            .input('fk_id_producto',sql.Int, fk_id_producto)
            .execute('EliminarDetalleCarrito'); // Llamar al SP EliminarDetalleCarrito
    } catch (error) {
        console.error('Error eliminando Detalle', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
}

const ActualizarDetalleCarrito = async (data) => {
    const { fk_id_producto, fk_id_usuario, nueva_cantidad } = data;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('fk_id_usuario',sql.Int, fk_id_usuario)
            .input('fk_id_producto',sql.Int, fk_id_producto)
            .input('nueva_cantidad',sql.Int, nueva_cantidad)
            .execute('ActualizarDetalleCarrito'); // Llamar al SP ActualizarDetalleCarrito
    } catch (error) {
        throw error;
    }
}

const ConfirmarCarrito = async (fk_id_usuario) => {
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('fk_id_usuario',sql.Int, fk_id_usuario)
            .execute('ConfirmarCarrito'); // Llamar al SP ConfirmarCarrito
    } catch (error) {
        throw error;
    }
}


export default {
    obtenerDetallesCarritoPorUsuario,
    AgregarProductoAlCarrito,
    EliminarDetalleCarrito,
    ActualizarDetalleCarrito,
    ConfirmarCarrito
};