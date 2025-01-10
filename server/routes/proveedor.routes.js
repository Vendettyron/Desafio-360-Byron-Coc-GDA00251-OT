import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import { obtenerProveedor,
    crearProveedor,
    actualizarProveedor,
    activarProveedor,
    inactivarProveedor,
    obtenerProveedorPorId
} from "../controllers/proveedorController.js";

import Roles from "../config/roles.js";

const router = express.Router();

/**
 * @route Get /api/proveedor/ObtenerProveedor
 * @desc Ver la lista de proveedores
 * @access Privado (Admin)
 */

router.get( 
    "/ObtenerProveedor",
    authMiddleware,
    roleMiddleware([Roles.ADMIN,Roles.CLIENTE]),
    obtenerProveedor
);


/**
 * @route POST /api/proveedor/ObtenerProveedoresActivos
 * @desc Ver la lista de proveedores
 * @access Privado (Admin)
 */

router.get( 
    "/ObtenerProveedoresActivos",
    authMiddleware,
    roleMiddleware([Roles.ADMIN]),
   
);


/**
 * @route POST /api/proveedor/ObtenerProveedorPorId/:id
 * @desc Ver proveedor individual
 * @access admin
 */

router.get( 
    "/ObtenerProveedorPorId/:id",
    authMiddleware,
    roleMiddleware([Roles.ADMIN, Roles.CLIENTE]),
    obtenerProveedorPorId
);
/**
 * @route POST /api/proveedor/CrearProveedor
 * @desc Crear una nuevo proveedor
 * @access Privado (Admin)
 */

router.post( 
    "/CrearProveedor",
    authMiddleware,
    roleMiddleware([Roles.ADMIN]),
    crearProveedor
);

/**
 * @route POST /api/proveedor/ActualizarProveedor
 * @desc Actualizar un proveedor
 * @access Privado (Admin)
 */

router.put( 
    "/ActualizarProveedor/:id",
    authMiddleware,
    roleMiddleware([Roles.ADMIN]),
    actualizarProveedor
);

/**
 * @route POST /api/proveedor/ActivarProveedor
 * @desc Activar un proveedor
 * @access Privado (Admin)
 */

router.put( 
    "/ActivarProveedor/:id",
    authMiddleware,
    roleMiddleware([Roles.ADMIN]),
    activarProveedor
);

/**
 * @route POST /api/proveedor/InactivarProveedor
 * @desc Inactivar un proveedor
 * @access Privado (Admin)
 */

router.put( 
    "/InactivarProveedor/:id",
    authMiddleware,
    roleMiddleware([Roles.ADMIN]),
    inactivarProveedor
);

export default router;