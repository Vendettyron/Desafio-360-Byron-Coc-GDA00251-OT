import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import Roles from "../config/roles.js";

import {
    actualizarUsuario,
    inactivarUsuario,
    activarUsuario,
    obtenerUsuarios,
    ObtenerUsuarioPorId,
    inactivarUsuarioElMismo,
    actualizarUsuarioElMismo,
    actualizarPasswordUsuario
} from "../controllers/usuariosController.js";

const router = express.Router();


/**
 * @route GET /api/usuarios/ObtenerUsuarios
 * @desc Ver la lista de usuarios
 * @access Privado (Admin)
 */
router.get(
    "/ObtenerUsuarios",
    authMiddleware,
    roleMiddleware([Roles.ADMIN]),
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
    roleMiddleware([Roles.ADMIN]),
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
    roleMiddleware([Roles.ADMIN]),
    actualizarUsuario
);


/**
 * @route PUT /api/usuarios/ActualizarUsuarioElMismo
 * @desc El clieten actualiza su información
 * @access Privado (Cliente)
 */
router.put(
    "/ActualizarUsuarioElMismo",
    authMiddleware,
    roleMiddleware([Roles.CLIENTE]),
    actualizarUsuarioElMismo
);

/**
 * @route PUT /api/usuarios/ActualizarPasswordUsuario
 * @desc El cliente actualiza su contraseña
 * @access Privado (Cliente)
 */

router.put(
    "/ActualizarPasswordUsuario",
    authMiddleware,
    roleMiddleware([Roles.CLIENTE]),
    actualizarPasswordUsuario
);



/**
 * @route PUT /api/usuarios/InactivarUsuario/:id
 * @desc Inactivar un usuario existente
 * @access Privado (Admin)
 */
router.put(
    "/InactivarUsuario/:id",
    authMiddleware,
    roleMiddleware([Roles.ADMIN]),
    inactivarUsuario
);

/**
 * @route PUT /api/usuarios/InactivarUsuarioElMismo
 * @desc El usuario inactiva su cuenta
 * @access Privado (Cliente)
 */
router.put(
    "/InactivarUsuarioElMismo",
    authMiddleware,
    roleMiddleware([Roles.CLIENTE]),
    inactivarUsuarioElMismo
);

/**
 * @route PUT /api/usuarios/ActivarUsuario/:id
 * @desc Activar un usuario existente
 * @access Privado (Admin)
 */
router.put(
    "/ActivarUsuario/:id",
    authMiddleware,
    roleMiddleware([Roles.ADMIN]),
    activarUsuario
);

export default router;
