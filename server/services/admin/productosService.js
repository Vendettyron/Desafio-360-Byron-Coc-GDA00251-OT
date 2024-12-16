import { poolPromise, sql } from '../../database/DbConection.js';

export const crearProducto = async (data) => {
    const { fk_categoria, fk_estado, fk_proveedor, nombre, descripcion, precio, stock, fk_id_usuario } = data;
    
    try {
        const pool = await poolPromise; 
        await pool.request()
            .input('fk_categoria', sql.Int, fk_categoria)
            .input('fk_estado', sql.Int, fk_estado)
            .input('fk_proveedor', sql.Int, fk_proveedor)
            .input('nombre', sql.VarChar(100), nombre)
            .input('descripcion', sql.NVarChar, descripcion)
            .input('precio', sql.Decimal(10, 2), precio)
            .input('stock', sql.Int, stock)
            .input('fk_id_usuario', sql.Int, fk_id_usuario)
            .execute('InsertarProducto'); // Llamar al SP InsertarProducto
    } catch (error) {
        throw error;
    }
};

export const actualizarProducto = async (data) => {
    const { id_producto, fk_categoria, fk_estado, fk_proveedor, nombre, descripcion, precio, stock, fk_id_usuario } = data;

    try {
        const pool = await poolPromise; 
        await pool.request()
            .input('id_producto', sql.Int, id_producto)
            .input('fk_categoria', sql.Int, fk_categoria)
            .input('fk_estado', sql.Int, fk_estado)
            .input('fk_proveedor', sql.Int, fk_proveedor)
            .input('nombre', sql.VarChar(100), nombre)
            .input('descripcion', sql.NVarChar, descripcion)
            .input('precio', sql.Decimal(10, 2), precio)
            .input('stock', sql.Int, stock)
            .input('fk_id_usuario', sql.Int, fk_id_usuario)
            .execute('ActualizarProducto'); // Llamar al SP ActualizarProducto
    } catch (error) {
        throw error;
    }
};

export const inactivarProducto = async (data) => {
    const { id_producto, fk_id_usuario } = data;

    try {
        const pool = await poolPromise; 
        await pool.request()
            .input('id_producto', sql.Int, id_producto)
            .input('fk_id_usuario', sql.Int, fk_id_usuario)
            .execute('InactivarProducto'); // Llamar al SP InactivarProducto
    } catch (error) {
        throw error;
    }
};

export const activarProducto = async (data) => {
    const { pk_id_producto, id_usuario_accion } = data;

    try {
        const pool = await poolPromise; 
        await pool.request()
            .input('pk_id_producto', sql.Int, pk_id_producto)
            .input('id_usuario_accion', sql.Int, id_usuario_accion)
            .execute('ActivarProducto'); // Llamar al SP ActivarProducto
    } catch (error) {
        throw error;
    }
};

export const obtenerProductos = async () => {
    try {
        const pool = await poolPromise; 
        const result = await pool.request()
            .execute('ObtenerProductos'); // Asegúrate de tener este SP creado
        return result.recordset;
    } catch (error) {
        throw error;
    }
};

export default {
    crearProducto,
    actualizarProducto,
    inactivarProducto,
    activarProducto,
    obtenerProductos,
};
