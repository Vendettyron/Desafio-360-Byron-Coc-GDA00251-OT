import { poolPromise} from '../../database/DbConection.js';
import usuariosService from '../../services/admin/usuariosService.js';
import bcrypt from 'bcrypt';

export const obtenerUsuarios = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
        .query('SELECT * FROM Usuarios'); //  consulta

        res.json(result.recordset);
    } catch (error) {
        console.error('Error obteniendo Usuarios:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
}

/**
 * Actualizar un usuario existente
 * Accesible solo para Admin
 */
export const actualizarUsuario = async (req, res) => {
    const { nombre, apellido, direccion, correo, telefono, password, fk_rol, fk_estado } = req.body;
    const { id } = req.params; // Obtener el ID del usuario desde req.params
    const id_usuario = Number(id); // Convertir a número
    const fk_id_usuario = req.user.id; // Obtener el ID del usuario que realiza la operación

    // Validar que se proporcionaron todos los campos necesarios
    if (!id_usuario || !nombre || !apellido || !direccion || !correo || !telefono || !password || !fk_rol || !fk_estado || !fk_id_usuario) {
        return res.status(400).json({ message: 'Faltan campos obligatorios o los datos son inválidos.' });
    }

    try {
        await usuariosService.actualizarUsuario({
            id_usuario,
            nombre,
            apellido,
            direccion,
            correo,
            telefono,
            password,
            fk_rol,
            fk_estado,
            fk_id_usuario
        });

        res.json({ message: 'Usuario actualizado exitosamente.' });
    } catch (error) {
        console.error('Error actualizando usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

/**
 * Inactivar un usuario existente
 * Accesible solo para Admin
 */
export const inactivarUsuario = async (req, res) => {
    const { id } = req.params; // Obtener el ID del usuario desde req.params
    const id_usuario = Number(id); // Convertir a número
    const fk_id_usuario = req.user.id; // Obtener el ID del usuario que realiza la operación

    // Validar que se proporcionaron todos los campos necesarios
    if (!id_usuario ||  !fk_id_usuario) {
        return res.status(400).json({ message: 'Faltan campos obligatorios o los datos son inválidos.' });
    }

    try {
        await usuariosService.inactivarUsuario({
            id_usuario,
            fk_id_usuario
        });

        res.json({ message: 'Usuario inactivado exitosamente.' });
    } catch (error) {
        console.error('Error inactivando usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

/**
 * Activar un usuario existente
 * Accesible solo para Admin
 */
export const activarUsuario = async (req, res) => {
    const { id } = req.params; // Obtener el ID del usuario desde req.params
    const pk_id_usuario = Number(id); // Convertir a número
    const id_usuario_accion = req.user.id; // Obtener el ID del usuario que realiza la acción

    // Validar que se proporcionaron todos los campos necesarios
    if (!pk_id_usuario || !id_usuario_accion) {
        return res.status(400).json({ message: 'Faltan campos obligatorios o los datos son inválidos.' });
    }

    try {
        await usuariosService.activarUsuario({
            pk_id_usuario,
            id_usuario_accion
        });

        res.json({ message: 'Usuario activado exitosamente.' });
    } catch (error) {
        console.error('Error activando usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};
