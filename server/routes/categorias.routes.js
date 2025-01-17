import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import Roles from "../config/roles.js";

import { 
    crearCategoria,
    actualizarCategoria,
    activarCategoria,
    inactivarCategoria,
    obtenerCategoriaPorId,
    obtenerCategorias,
    obtenerCategoriasActivas
} from "../controllers/categoriasController.js";

const router = express.Router();

/**
 * @route POST /api/categorias/obtenerCategorias
 * @desc Ver la lista de categorias
 * @access Privado (Admin)
 */

router.get( 
    "/ObtenerCategorias",
    authMiddleware,
    roleMiddleware([Roles.ADMIN,Roles.CLIENTE]),
    obtenerCategorias
);

/**
 * @route POST /api/categorias/obtenerCategoriasActivas
 * @desc Ver la lista de categorias activas
 * @access cliente y admin
 */

router.get( 
    "/ObtenerCategoriasActivas",
    authMiddleware,
    roleMiddleware([Roles.ADMIN,Roles.CLIENTE]),
    obtenerCategoriasActivas
);


/**
 * @route POST /api/categorias/ObtenerCategoriasPorId/:id
 * @desc Ver categoria individual
 * @access Privado (Admin)
 */

router.get( 
    "/ObtenerCategoriasPorId/:id",
    authMiddleware,
    roleMiddleware([Roles.ADMIN, Roles.CLIENTE]),
    obtenerCategoriaPorId
);

/**
 * @route POST /api/categorias/CrearCategoria
 * @desc Crear una nueva categoria
 * @access Privado (Admin)
 */

router.post( 
    "/CrearCategoria",
    authMiddleware,
    roleMiddleware([Roles.ADMIN]),
    crearCategoria
);

/**
 * @route POST /api/categorias/ActualizarCategoria
 * @desc Actualizar una categoria
 * @access Privado (Admin)
 */

router.put( 
    "/ActualizarCategoria/:id",
    authMiddleware,
    roleMiddleware([Roles.ADMIN]),
    actualizarCategoria
);

/**
 * @route POST /api/categorias/ActivarCategoria
 * @desc Activar una categoria
 * @access Privado (Admin)
 */

router.put( 
    "/ActivarCategoria/:id",
    authMiddleware,
    roleMiddleware([Roles.ADMIN]),
    activarCategoria
);

/**
 * @route POST /api/categorias/InactivarCategoria
 * @desc Inactivar una categoria
 * @access Privado (Admin)
 */

router.put( 
    "/InactivarCategoria/:id",
    authMiddleware,
    roleMiddleware([Roles.ADMIN]),
    inactivarCategoria
);

export default router;