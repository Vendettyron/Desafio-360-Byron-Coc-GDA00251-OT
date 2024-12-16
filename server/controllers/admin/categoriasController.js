import { poolPromise} from '../../database/DbConection.js';

import categoriasService from '../../services/admin/categoriasService.js'
/**
 * Obtener la lista de Categorias
 * Accesible para Admin
 */

export const obtenerCategorias = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
        .query('SELECT * FROM Categorias'); //  consulta

        res.json(result.recordset);
    } catch (error) {
        console.error('Error obteniendo categorias:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};
/**
 * Crear una nueva Categoria
 * Accesible para Admin
 */
export const crearCategoria = async (req, res) => {
    const { nombre,descripcion,fk_estado} = req.body;
    const fk_id_usuario = req.user.id; // Obtener el ID del usuario desde req.user

    // Validar que se proporcionaron todos los campos necesarios
    if (!nombre || !descripcion || !fk_estado || !fk_id_usuario) {
        return res.status(400).json({ message: 'Faltan campos obligatorios.' });
    }

    try {
        await categoriasService.crearCategoria({
            nombre,
            descripcion,
            fk_estado,
            fk_id_usuario
        });

        res.json({ message: 'Categoria creada con exito' });
    } catch (error) {
        console.error('Error creando categoria:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

/**
 * Actualizar una categoria existente
 * Accesible para Admin
 */

export const actualizarCategoria = async (req, res) => {
    const { nombre, descripcion, fk_estado } = req.body;
    const { id } = req.params; // Obtener el ID de la categoria desde req.params
    const id_categoria = Number(id); // Convertir a número
    const fk_id_usuario = req.user.id; // Obtener el ID del usuario desde req.user

    // Validar que se proporcionaron todos los campos necesarios
    if (!id_categoria ||!nombre || !descripcion || !fk_estado||!fk_id_usuario) {
        return res.status(400).json({ message: 'Faltan campos obligatorios.' });
    }

    try {
        await categoriasService.actualizarCategoria({
            id_categoria,
            nombre,
            descripcion,
            fk_estado,
            fk_id_usuario
        });

        res.json({ message: 'Categoria actualizada con exito' });
    } catch (error) {
        console.error('Error actualizando categoria:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

export const activarCategoria = async (req, res) => {
    const { id } = req.params; // Obtener el ID de la categoria desde req.params
    const pk_id_categoria = Number(id); // Convertir a número
    const id_usuario_accion = req.user.id; // Obtener el ID del usuario desde req.user

    // Validar que se proporcionaron todos los campos necesarios
    if (!pk_id_categoria || !id_usuario_accion) {
        return res.status(400).json({ message: 'Faltan campos obligatorios.' });
    }

    try {
        await categoriasService.activarCategoria({
            pk_id_categoria,
            id_usuario_accion
        });

        res.json({ message: 'Categoria activada con exito' });
    } catch (error) {
        console.error('Error activando categoria:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
}

export const inactivarCategoria = async (req, res) => {
    const { id } = req.params; // Obtener el ID de la categoria desde req.params
    const id_categoria = Number(id); // Convertir a número
    const fk_id_usuario = req.user.id; // Obtener el ID del usuario desde req.user

    // Validar que se proporcionaron todos los campos necesarios
    if (!id_categoria || !fk_id_usuario) {
        return res.status(400).json({ message: 'Faltan campos obligatorios.' });
    }

    try {
        await categoriasService.inactivarCategoria({
            id_categoria,
            fk_id_usuario
        });

        res.json({ message: 'Categoria Inactivada con exito' });
    } catch (error) {
        console.error('Error Inactivando categoria:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
}