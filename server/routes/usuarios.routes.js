import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

import {
    actualizarUsuario,
    inactivarUsuario,
    activarUsuario,
    obtenerUsuarios,
    ObtenerUsuarioPorId
} from "../controllers/usuariosController.js";

const router = express.Router();

// Role 1: Administrador
// Role 2: Cliente

/**
 * @route GET /api/usuarios/ObtenerUsuarios
 * @desc Ver la lista de usuarios
 * @access Privado (Admin)
 */
router.get(
    "/ObtenerUsuarios",
    authMiddleware,
    roleMiddleware([1]),
    obtenerUsuarios
);

/**
 * @route GET /api/usuarios/ObtenerUsuarioPorId/:id
 * @desc Ver Usuario individual
 * @access Privado (Admin)
 */
router.get(
    "/ObtenerUsuarioPorId/:id",
    authMiddleware,
    roleMiddleware([1]),
    ObtenerUsuarioPorId
);

/**
 * @route PUT /api/usuarios/ActualizarUsuario/:id
 * @desc Actualizar un usuario existente
 * @access Privado (Admin)
 */
router.put(
    "/ActualizarUsuario/:id",
    authMiddleware,
    roleMiddleware([1]),
    actualizarUsuario
);

/**
 * @route PUT /api/usuarios/InactivarUsuario/:id
 * @desc Inactivar un usuario existente
 * @access Privado (Admin)
 */
router.put(
    "/InactivarUsuario/:id",
    authMiddleware,
    roleMiddleware([1]),
    inactivarUsuario
);

/**
 * @route PUT /api/usuarios/ActivarUsuario/:id
 * @desc Activar un usuario existente
 * @access Privado (Admin)
 */
router.put(
    "/ActivarUsuario/:id",
    authMiddleware,
    roleMiddleware([1]),
    activarUsuario
);

export default router;
