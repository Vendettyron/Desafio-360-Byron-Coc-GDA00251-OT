import express from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
import roleMiddleware from "../../middleware/roleMiddleware.js";

import { obtenerCategorias, 
        crearCategoria,
        actualizarCategoria,
        activarCategoria,
        inactivarCategoria
} from "../../controllers/admin/categoriasController.js";

const router = express.Router();

/**
 * @route POST /api/admin/categorias/obtenerCategorias
 * @desc Ver la lista de categorias
 * @access Privado (Admin)
 */

router.get( 
    "/obtenerCategorias",
    authMiddleware,
    roleMiddleware([1]),
    obtenerCategorias
);

/**
 * @route POST /api/admin/categorias/CrearCategoria
 * @desc Crear una nueva categoria
 * @access Privado (Admin)
 */

router.post( 
    "/CrearCategoria",
    authMiddleware,
    roleMiddleware([1]),
    crearCategoria
);

/**
 * @route POST /api/admin/categorias/ActualizarCategoria
 * @desc Actualizar una categoria
 * @access Privado (Admin)
 */

router.put( 
    "/ActualizarCategoria/:id",
    authMiddleware,
    roleMiddleware([1]),
    actualizarCategoria
);

/**
 * @route POST /api/admin/categorias/ActivarCategoria
 * @desc Activar una categoria
 * @access Privado (Admin)
 */

router.put( 
    "/ActivarCategoria/:id",
    authMiddleware,
    roleMiddleware([1]),
    activarCategoria
);

/**
 * @route POST /api/admin/categorias/InactivarCategoria
 * @desc Inactivar una categoria
 * @access Privado (Admin)
 */

router.put( 
    "/InactivarCategoria/:id",
    authMiddleware,
    roleMiddleware([1]),
    inactivarCategoria
);

export default router;