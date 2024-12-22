import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import {
    obtenerEstados,
    crearEstado,
    actualizarEstado
} from "../controllers/estadosController.js";

const router = express.Router();

// Role 1: Administrador
// Role 2: Cliente

/**
 * @route GET /api/estados/ObtenerEstados
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
 * @route POST /api/estados/CrearEstado
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
 * @route PUT /api/estados/ActualizarEstado/:id
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
