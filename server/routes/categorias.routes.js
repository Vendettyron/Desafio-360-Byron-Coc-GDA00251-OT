import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

import { obtenerCategorias, 
        crearCategoria,
        actualizarCategoria,
        activarCategoria,
        inactivarCategoria,
        obtenerCategoriaPorId
} from "../controllers/categoriasController.js";

// Role 1: Administrador
// Role 2: Cliente

const router = express.Router();

/**
 * @route POST /api/categorias/obtenerCategorias
 * @desc Ver la lista de categorias
 * @access Privado (Admin)
 */

router.get( 
    "/ObtenerCategorias",
    authMiddleware,
    roleMiddleware([1]),
    obtenerCategorias
);

/**
 * @route POST /api/categorias/ObtenerCategoriasPorId/:id
 * @desc Ver categoria individual
 * @access Privado (Admin)
 */

router.get( 
    "/ObtenerCategoriasPorId/:id",
    authMiddleware,
    roleMiddleware([1,2]),
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
    roleMiddleware([1]),
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
    roleMiddleware([1]),
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
    roleMiddleware([1]),
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
    roleMiddleware([1]),
    inactivarCategoria
);

export default router;