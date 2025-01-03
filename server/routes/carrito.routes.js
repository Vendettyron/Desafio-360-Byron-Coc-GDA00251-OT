import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import Roles from "../config/roles.js";

import { obtenerDetallesCarritoPorUsuario,
    AgregarProductoAlCarrito,
    EliminarDetalleCarrito,
    ActualizarDetalleCarrito,
    ConfirmarCarrito,
    EliminarDetallesCarrito
} from "../controllers/carrito.Controller.js";


const router = express.Router();

/**
 * @route GET /api/carrito/ObtenerDetallesCarritoPorUsuario
 * @desc Ver detalles del carrito de un usuario
 * @access cliuente y admin
 */

router.get( 
    "/ObtenerDetallesCarritoPorUsuario",
    authMiddleware,
    roleMiddleware([Roles.ADMIN, Roles.CLIENTE]),
    obtenerDetallesCarritoPorUsuario
);

/**
 * @route POST /api/carrito/AgregarProductoAlCarrito/:id
 * @desc Agregar un producto al carrito
 * @access cliuente y admin
 * @param {number} id - ID del producto
 */

router.post( 
    "/AgregarProductoAlCarrito/:id",
    authMiddleware,
    roleMiddleware([Roles.ADMIN, Roles.CLIENTE]),
    AgregarProductoAlCarrito
);

/**
 * @route DELETE /api/carrito/EliminarDetalleCarrito/:id
 * @desc Eliminar un detalle especifico del carrito
 * @access cliuente y admin
 */

router.delete( 
    "/EliminarDetalleCarrito/:id",
    authMiddleware,
    roleMiddleware([Roles.ADMIN, Roles.CLIENTE]),
    EliminarDetalleCarrito
);

/**
 * @route DELETE /api/carrito/EliminarDetallesCarrito/:id
 * @desc Eliminar todos los detalles del carrito de un usuario
 * @access cliuente y admin
 */

router.delete( 
    "/EliminarDetallesCarrito",
    authMiddleware,
    roleMiddleware([Roles.ADMIN, Roles.CLIENTE]),
    EliminarDetallesCarrito
);

/**
 * @route PUT /api/carrito/ConfirmarCarrito
 * @desc Confirmar un carrito para que se vuelva un Pedido
 * @access cliuente y admin
 */

router.put( 
    "/ConfirmarCarrito",
    authMiddleware,
    roleMiddleware([Roles.ADMIN, Roles.CLIENTE]),
    ConfirmarCarrito
);

/**
 * @route PUT /api/carrito/ActualizarDetalleCarrito/:id
 * @desc Actualizar un detalle del carrito (cantidad)
 * @access cliuente y admin
 */

router.put( 
    "/ActualizarDetalleCarrito/:id",
    authMiddleware,
    roleMiddleware([Roles.ADMIN, Roles.CLIENTE]),
    ActualizarDetalleCarrito
);

export default router;
