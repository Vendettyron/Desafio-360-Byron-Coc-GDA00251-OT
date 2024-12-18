import express from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
import roleMiddleware from "../../middleware/roleMiddleware.js";

import { obtenerProveedor,
        crearProveedor,
        actualizarProveedor,
        activarProveedor,
        inactivarProveedor,
        obtenerProveedorPorId
} from "../../controllers/admin/proveedorController.js";

const router = express.Router();

/**
 * @route POST /api/admin/proveedor/ObtenerProveedor
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
 * @route POST /api/admin/proveedor/ObtenerProveedorPorId/:id
 * @desc Ver proveedor individual
 * @access admin y cliente
 */

router.get( 
    "/ObtenerProveedorPorId/:id",
    authMiddleware,
    roleMiddleware([1]),
    obtenerProveedorPorId
);
/**
 * @route POST /api/admin/proveedor/CrearProveedor
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
 * @route POST /api/admin/proveedor/ActualizarProveedor
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
 * @route POST /api/admin/proveedor/ActivarProveedor
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
 * @route POST /api/admin/proveedor/InactivarProveedor
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