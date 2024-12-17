import { poolPromise, sql } from '../../database/DbConection.js';

/**
 * Crear un nuevo Estado
 */
const crearEstado = async (data) => {
    const { nombre, fk_id_usuario_operacion } = data;

    try {
        const pool = await poolPromise; // Esperar a que la promesa se resuelva
        await pool.request()
            .input('nombre', sql.VarChar(50), nombre)
            .input('fk_id_usuario_operacion', sql.Int, fk_id_usuario_operacion)
            .execute('InsertarEstado'); // Llamar al SP InsertarEstado
    } catch (error) {
        throw error;
    }
};

/**
 * Actualizar un Estado existente
 */
const actualizarEstado = async (data) => {
    const { pk_id_estado, nombre, fk_id_usuario_operacion } = data;

    try {
        const pool = await poolPromise;
        await pool.request()
            .input('pk_id_estado', sql.Int, pk_id_estado)
            .input('nombre', sql.VarChar(50), nombre)
            .input('fk_id_usuario_operacion', sql.Int, fk_id_usuario_operacion)
            .execute('ActualizarEstado'); // Llamar al SP ActualizarEstado
    } catch (error) {
        throw error;
    }
};


export default {
    crearEstado,
    actualizarEstado,
};
