import { poolPromise} from '../database/DbConection.js';
import estadosService from '../services/estadosService.js';

/**
 * Obtener la lista de Estados
 * Accesible para Admin
 */
export const obtenerEstados = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
        .query('SELECT * FROM Estados'); //  consulta

        res.json(result.recordset);
    } catch (error) {
        console.error('Error obteniendo estados:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

/**
 * Crear un nuevo Estado
 * Accesible solo para Admin
 */
export const crearEstado = async (req, res) => {
    const { nombre } = req.body;
    const fk_id_usuario_operacion = req.user.id; // Obtener el ID del usuario desde req.user

    if (!nombre) {
        return res.status(400).json({ message: 'Faltan campos obligatorios.' });
    }

    try {
        await estadosService.crearEstado({
            nombre,
            fk_id_usuario_operacion
        });

        res.status(201).json({ message: 'Estado creado exitosamente.' });
    } catch (error) {
        console.error('Error creando estado:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

/**
 * Actualizar un Estado existente
 * Accesible solo para Admin
 */
export const actualizarEstado = async (req, res) => {
    const { nombre } = req.body;
    const { id } = req.params; // Obtener el ID del estado desde req.params
    const pk_id_estado = Number(id); // Convertir a número
    const fk_id_usuario_operacion = req.user.id; // Obtener el ID del usuario desde req.user


    // Validar que se proporcionaron todos los campos necesarios y que pk_id_estado es válido
    if (!pk_id_estado || !nombre || !fk_id_usuario_operacion) {
        return res.status(400).json({ message: 'ID del estado inválido.' });
    }

    try {
        await estadosService.actualizarEstado({
            pk_id_estado,
            nombre,
            fk_id_usuario_operacion
        });

        res.json({ message: 'Estado actualizado exitosamente.' });
    } catch (error) {
        console.error('Error actualizando estado:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};
