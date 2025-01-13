import { poolPromise} from '../database/DbConection.js';
import usuariosService from '../services/usuariosService.js';
import bcrypt from 'bcrypt';
import { sql } from '../database/DbConection.js';

export const ObtenerUsuarioPorId = async (req, res) => {
    const {id} = req.params; // Obtener el ID del usuario desde req.params
    const pk_id_usuario = Number(id); // Convertir a número

    // Validar que el ID sea válido

    if (!pk_id_usuario) {
        return res.status(400).json({ message: 'ID del usuario invalido.' });
    }

    try {
        const usuario = await usuariosService.obtnerUsuarioPorId(pk_id_usuario);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }
        res.json(usuario);
    } catch (error) {   
        console.error('Error obteniendo usuario por ID:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
}


// Obtener la lista de usuarios
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
 * El usuario actualiza su propia cuenta
 * Accesible solo para clientes
 */
export const actualizarUsuarioElMismo = async (req, res) => {
    const { nombre, apellido, direccion, correo, telefono} = req.body;
    const pk_id_usuario = req.user.id; // Obtener el ID del usuario que realiza la operación

    // Validar que se proporcionaron todos los campos necesarios
    if ( !nombre || !apellido || !direccion || !correo || !telefono || !pk_id_usuario) {
        return res.status(400).json({ message: 'Faltan campos obligatorios o los datos son inválidos.' });
    }

    try {
        await usuariosService.actualizarUsuarioElMismo({
            pk_id_usuario,
            nombre,
            apellido,
            direccion,
            correo,
            telefono,     
        });

        res.json({ message: 'Usuario actualizado exitosamente.' });
    } catch (error) {
        console.error('Error actualizando usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

/**
 * El cliente actualiza su contraseña
 * Accesible solo para clientes
 */

export const actualizarPasswordUsuario = async (req, res) => {
    const { actualPassword, newPassword } = req.body;
    const pk_id_usuario = req.user.id; // Obtener el ID del usuario que realiza la operación

    // Validar que se proporcionaron todos los campos necesarios

    if (!newPassword || !pk_id_usuario || !actualPassword) {
        return res.status(400).json({ message: 'Faltan campos obligatorios o los datos son inválidos.' });
    }

    try {   
        
        const usuario = await usuariosService.obtnerUsuarioPorId(pk_id_usuario);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        // Verificar la contraseña actual utilizando bcrypt

        const passwordValida = await bcrypt.compare(actualPassword, usuario.password);

        if (!passwordValida) {
            return res.status(401).json({ message: 'Contraseña actual incorrecta.' });
        }

        //Actualizar la contraseña en la base de datos
        await usuariosService.actualizarPasswordUsuario({
            pk_id_usuario,
            newPassword
        });

        res.json({ message: 'Contraseña actualizada exitosamente.' });
    }
    catch (error) {
        console.error('Error actualizando contraseña:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
}

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
 * El usuario Elimina su cuenta (inactiva)
 * Accesible par clientes
 */
export const inactivarUsuarioElMismo = async (req, res) => {
    const { correo, password } = req.body; // Obtener correo y contraseña desde el cuerpo de la solicitud
    const id_usuario = req.user.id; // Obtener el ID del usuario desde el token JWT

    // Validar que se proporcionaron ambos campos
    if (!correo || !password) {
        return res.status(400).json({ message: 'Se requieren el correo y la contraseña.' });
    }

    try {
        const pool = await poolPromise;

        // Obtener el usuario desde la base de datos
        const usuarioResult = await pool.request()
            .input('correo', sql.VarChar, correo)
            .query('SELECT pk_id_usuario, password, fk_estado FROM Usuarios WHERE correo = @correo');

        if (usuarioResult.recordset.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        const usuario = usuarioResult.recordset[0];

        // Verificar si el usuario ya está inactivo
        if (usuario.fk_estado === 2) {
            return res.status(400).json({ message: 'La cuenta ya está inactiva.' });
        }

        // Verificar la contraseña utilizando bcrypt
        const passwordValida = await bcrypt.compare(password, usuario.password);

        if (!passwordValida) {
            return res.status(401).json({ message: 'Contraseña incorrecta.' });
        }

        // Llamar al Stored Procedure para inactivar la cuenta
        await pool.request()
            .input('id_usuario', sql.Int, id_usuario)
            .input('fk_id_usuario', sql.Int, id_usuario) // Mismo usuario
            .execute('InactivarUsuarioElMismo');


        res.status(200).json({ message: 'Cuenta inactivada exitosamente.' });
    } catch (error) {
        console.error('Error en eliminarUsuarioElMismo:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
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
