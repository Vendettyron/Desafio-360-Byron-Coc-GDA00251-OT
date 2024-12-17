import express from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
import roleMiddleware from "../../middleware/roleMiddleware.js";
import {
    obtenerEstados,
    crearEstado,
    actualizarEstado
} from "../../controllers/admin/estadosController.js";

const router = express.Router();

/**
 * @route GET /api/admin/estados/ObtenerEstados
 * @desc Obtener la lista de estados
 * @access Privado (Admin)
 */
router.get(
    "/ObtenerEstados",
    authMiddleware,
    roleMiddleware([1]),
    obtenerEstados
);

/**
 * @route POST /api/admin/estados/CrearEstado
 * @desc Crear un nuevo estado
 * @access Privado (Admin)
 */
router.post(
    "/CrearEstado",
    authMiddleware,
    roleMiddleware([1]),
    crearEstado
);

/**
 * @route PUT /api/admin/estados/ActualizarEstado/:id
 * @desc Actualizar un estado existente
 * @access Privado (Admin)
 */
router.put(
    "/ActualizarEstado/:id",
    authMiddleware,
    roleMiddleware([1]),
    actualizarEstado
);

export default router;
