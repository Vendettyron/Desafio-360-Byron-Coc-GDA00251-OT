import express from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
import roleMiddleware from "../../middleware/roleMiddleware.js";

import {
    actualizarUsuario,
    inactivarUsuario,
    activarUsuario,
    obtenerUsuarios,
    ObtenerUsuarioPorId
} from "../../controllers/admin/usuariosController.js";

const router = express.Router();

/**
 * @route GET /api/admin/usuarios/ObtenerUsuarios
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
 * @route GET /api/admin/usuarios/ObtenerUsuarioPorId/:id
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
 * @route PUT /api/admin/usuarios/ActualizarUsuario/:id
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
 * @route PUT /api/admin/usuarios/InactivarUsuario/:id
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
 * @route PUT /api/admin/usuarios/ActivarUsuario/:id
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
