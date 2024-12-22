import { poolPromise, sql } from '../database/DbConection.js';
import bcrypt from 'bcrypt';

/**
 * Obtener un usuario por su ID
 */
export const obtnerUsuarioPorId = async (pk_id_usuario) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id_usuario', sql.Int, pk_id_usuario)
            .execute('ObtenerUsuarioPorId'); // Llamar al SP ObtenerUsuarioPorId

        return result.recordset[0];
    } catch (error) {
        throw error;
    }
}
/**
 * Actualizar un usuario existente
 */
export const actualizarUsuario = async (data) => {
    const { id_usuario, nombre, apellido, direccion, correo, telefono, password, fk_rol, fk_estado, fk_id_usuario } = data;

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
        const pool = await poolPromise; // Esperar a que la promesa se resuelva
        await pool.request()
            .input('id_usuario', sql.Int, id_usuario)
            .input('nombre', sql.NVarChar(100), nombre)
            .input('apellido', sql.NVarChar(100), apellido)
            .input('direccion', sql.NVarChar(100), direccion)
            .input('correo', sql.NVarChar(100), correo)
            .input('telefono', sql.NVarChar(8), telefono)
            .input('password', sql.NVarChar(255), hashedPassword)
            .input('fk_rol', sql.Int, fk_rol)
            .input('fk_estado', sql.Int, fk_estado)
            .input('fk_id_usuario', sql.Int, fk_id_usuario)
            .execute('ActualizarUsuario'); // Llamar al SP ActualizarUsuario
    } catch (error) {
        throw error;
    }
};

/**
 * Inactivar un usuario existente
 */
export const inactivarUsuario = async (data) => {
    const { id_usuario, fk_id_usuario } = data;

    try {
        const pool = await poolPromise;
        await pool.request()
            .input('id_usuario', sql.Int, id_usuario)
            .input('fk_id_usuario', sql.Int, fk_id_usuario)
            .execute('InactivarUsuario'); // Llamar al SP InactivarUsuario
    } catch (error) {
        throw error;
    }
};

/**
 * Activar un usuario existente
 */
export const activarUsuario = async (data) => {
    const { pk_id_usuario, id_usuario_accion } = data;

    try {
        const pool = await poolPromise;
        await pool.request()
            .input('pk_id_usuario', sql.Int, pk_id_usuario)
            .input('id_usuario_accion', sql.Int, id_usuario_accion)
            .execute('ActivarUsuario'); // Llamar al SP ActivarUsuario
    } catch (error) {
        throw error;
    }
};

export default {
    actualizarUsuario,
    inactivarUsuario,
    activarUsuario,
    obtnerUsuarioPorId
};
