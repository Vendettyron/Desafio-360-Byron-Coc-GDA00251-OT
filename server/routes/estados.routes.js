import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import {
    obtenerEstados,
    crearEstado,
    actualizarEstado
} from "../controllers/estadosController.js";
import Roles from "../config/roles.js";

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
    roleMiddleware([Roles.ADMIN]),
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
    roleMiddleware([Roles.ADMIN]),
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
    roleMiddleware([Roles.ADMIN]),
    actualizarEstado
);

export default router;
