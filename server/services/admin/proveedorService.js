import { poolPromise, sql } from '../../database/DbConection.js';

/**
 * Crear un nuevo proveedor
 */
const crearProveedor = async (data) => {
    const { nombre, telefono, correo, fk_estado, fk_id_usuario } = data;

    try {
        const pool = await poolPromise; // Esperar a que la promesa se resuelva
        await pool.request()
            .input('nombre', sql.NVarChar(100), nombre)
            .input('telefono', sql.NVarChar(8), telefono)
            .input('correo', sql.NVarChar(100), correo)
            .input('fk_estado', sql.Int, fk_estado)
            .input('fk_id_usuario', sql.Int, fk_id_usuario)
            .execute('InsertarProveedor'); // Llamar al SP InsertarProveedor
    } catch (error) {
        throw error;
    }
};

/**
 * Actualizar un proveedor existente
 */
const actualizarProveedor = async (data) => {
    const { pk_id_proveedor, nombre, telefono, correo, fk_estado, fk_id_usuario } = data;

    try {
        const pool = await poolPromise;
        await pool.request()
            .input('pk_id_proveedor', sql.Int, pk_id_proveedor)
            .input('nombre', sql.VarChar(100), nombre)
            .input('telefono', sql.VarChar(8), telefono)
            .input('correo', sql.VarChar(100), correo)
            .input('fk_estado', sql.Int, fk_estado)
            .input('fk_id_usuario', sql.Int, fk_id_usuario)
            .execute('ActualizarProveedor'); // Llamar al SP ActualizarProveedor
    } catch (error) {
        throw error;
    }
};

/**
 * Activar un proveedor existente
 */
const activarProveedor = async (data) => {
    const { pk_id_proveedor, id_usuario_accion } = data;

    try {
        const pool = await poolPromise;
        await pool.request()
            .input('pk_id_proveedor', sql.Int, pk_id_proveedor)
            .input('id_usuario_accion', sql.Int, id_usuario_accion)
            .execute('ActivarProveedor'); // Llamar al SP ActivarProveedor
    } catch (error) {
        throw error;
    }
};

/**
 * Inactivar un proveedor existente
 */
const inactivarProveedor = async (data) => {
    const { id_proveedor, fk_id_usuario } = data;

    try {
        const pool = await poolPromise;
        await pool.request()
            .input('id_proveedor', sql.Int, id_proveedor)
            .input('fk_id_usuario', sql.Int, fk_id_usuario)
            .execute('InactivarProveedor'); // Llamar al SP InactivarProveedor
    } catch (error) {
        throw error;
    }
};

const obtenerProveedorPorId = async (pk_id_proveedor) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('pk_id_proveedor', sql.Int,  pk_id_proveedor)
            .execute('ObtenerProveedorPorId'); // Llamar al SP ObtenerProveedorPorId

        return result.recordset[0];
    } catch (error) {
        throw error;
    }
}


export default {
    crearProveedor,
    actualizarProveedor,
    activarProveedor,
    inactivarProveedor,
    obtenerProveedorPorId
};
