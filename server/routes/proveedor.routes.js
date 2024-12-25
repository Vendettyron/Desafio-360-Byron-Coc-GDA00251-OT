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

const router = express.Router();

// Role 1: Administrador
// Role 2: Cliente

/**
 * @route Get /api/proveedor/ObtenerProveedor
 * @desc Ver la lista de proveedores
 * @access Privado (Admin)
 */

router.get( 
    "/ObtenerProveedor",
    authMiddleware,
    roleMiddleware([1]),
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
    roleMiddleware([1]),
   
);


/**
 * @route POST /api/proveedor/ObtenerProveedorPorId/:id
 * @desc Ver proveedor individual
 * @access admin
 */

router.get( 
    "/ObtenerProveedorPorId/:id",
    authMiddleware,
    roleMiddleware([1]),
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
    roleMiddleware([1]),
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
    roleMiddleware([1]),
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
    roleMiddleware([1]),
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
    roleMiddleware([1]),
    inactivarProveedor
);

export default router;