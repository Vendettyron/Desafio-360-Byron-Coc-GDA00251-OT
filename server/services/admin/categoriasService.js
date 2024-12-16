import { poolPromise, sql } from '../../database/DbConection.js';

export const crearCategoria = async (data) => {
    const { nombre, descripcion, fk_estado, fk_id_usuario } = data;

    try {
        const pool = await poolPromise;
        await pool.request()
            .input('nombre', sql.VarChar(100), nombre)
            .input('descripcion', sql.NVarChar, descripcion)
            .input('fk_estado', sql.Int, fk_estado)
            .input('fk_id_usuario', sql.Int, fk_id_usuario)
            .execute('InsertarCategoria'); // Llamar al SP InsertarCategoria
    } catch (error) {
        throw error;
    }
};
export const actualizarCategoria = async (data) => {
    const { id_categoria, nombre, descripcion, fk_estado,fk_id_usuario } = data;

    try {
        const pool = await poolPromise;
        await pool.request()
            .input('id_categoria', sql.Int, id_categoria)
            .input('nombre', sql.VarChar(100), nombre)
            .input('descripcion', sql.NVarChar, descripcion)
            .input('fk_estado', sql.Int, fk_estado)
            .input('fk_id_usuario', sql.Int, fk_id_usuario)
            .execute('ActualizarCategoria'); // Llamar al SP ActualizarCategoria
    } catch (error) {
        throw error;
    }
    
};

export const activarCategoria = async (data) => {   
    const { pk_id_categoria, id_usuario_accion} = data;

    try {
        const pool = await poolPromise;
        await pool.request()
            .input('pk_id_categoria', sql.Int, pk_id_categoria)
            .input('id_usuario_accion', sql.Int, id_usuario_accion)
            .execute('ActivarCategoria'); // Llamar al SP ActivarCategoria
    } catch (error) {
        throw error;
    }
}

export const inactivarCategoria = async (data) => {   
    const { id_categoria, fk_id_usuario} = data;

    try {
        const pool = await poolPromise;
        await pool.request()
            .input('id_categoria', sql.Int, id_categoria)
            .input('fk_id_usuario', sql.Int, fk_id_usuario )
            .execute('InactivarCategoria'); // Llamar al SP ActivarCategoria
    } catch (error) {
        throw error;
    }
}

export default {
    crearCategoria,
    actualizarCategoria,
    activarCategoria,
    inactivarCategoria
};