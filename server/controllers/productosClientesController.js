import { poolPromise, sql } from '../database/DbConection.js';

/**
 * Obtener la lista de productos
 */
export const obtenerProductosClientes = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query('SELECT * FROM Productos'); //  consulta

        res.json(result.recordset);
    } catch (error) {
        console.error('Error obteniendo productos:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};
