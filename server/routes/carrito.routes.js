import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import Roles from "../config/roles.js";

import { obtenerDetallesCarritoPorUsuario,
    AgregarProductoAlCarrito,
    EliminarDetalleCarrito,
    ActualizarDetalleCarrito,
    ConfirmarCarrito,
    EliminarDetallesCarrito,
    obtenerDetallesCarritoPorUsuarioAdmin,
    ActualizarDetalleCarritoAdmin,
    EliminarDetalleCarritoAdmin,
    AgregarProductoAlCarritoAdmin,
    EliminarDetallesCarritoAdmin
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
 * @route GET /api/carrito/ObtenerDetallesCarritoPorUsuarioAdmin
 * @desc Ver detalles del carrito de un usuario desde el admin
 * @access cliuente y admin
 */

router.get( 
    "/ObtenerDetallesCarritoPorUsuarioAdmin/:id",
    authMiddleware,
    roleMiddleware([Roles.ADMIN]),
    obtenerDetallesCarritoPorUsuarioAdmin
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
 * @route POST /api/carrito/AgregarProductoAlCarrito/:id
 * @desc Agregar un producto al carrito
 * @access cliuente y admin
 * @param {number} id - ID del producto
 */

router.post( 
    "/AgregarProductoAlCarritoAdmin/:idUsuario/:idProducto",
    authMiddleware,
    roleMiddleware([Roles.ADMIN]),
    AgregarProductoAlCarritoAdmin
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
 * @route DELETE /api/carrito/EliminarDetalleCarritoAdmin/:idUsuario/:idProducto
 * @desc Eliminar un detalle especifico del carrito de un usuario par el admin
 * @access  admin
 */

router.delete( 
    "/EliminarDetalleCarritoAdmin/:idUsuario/:idProducto",
    authMiddleware,
    roleMiddleware([Roles.ADMIN]),
    EliminarDetalleCarritoAdmin
);

/**
 * @route DELETE /api/carrito/EliminarDetallesCarrito/:id
 * @desc Eliminar todos los detalles del carrito de un usuario
 * @access admin y cliente
 */

router.delete( 
    "/EliminarDetallesCarrito",
    authMiddleware,
    roleMiddleware([Roles.ADMIN, Roles.CLIENTE]),
    EliminarDetallesCarrito
);

/**
 * @route DELETE /api/carrito/EliminarDetallesCarritoAdmin/:id
 * @desc Eliminar todos los detalles del carrito de un usuario por el admin
 * @access admin
 */

router.delete( 
    "/EliminarDetallesCarritoAdmin/:id",
    authMiddleware,
    roleMiddleware([Roles.ADMIN]),
    EliminarDetallesCarritoAdmin
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

/**
 * @route PUT /api/carrito/ActualizarDetalleCarritoAdmin/:idUsuario/:idProducto
 * @desc Actualizar un detalle del carrito (cantidad)
 * @access cliuente y admin
 */

router.put( 
    "/ActualizarDetalleCarritoAdmin/:idUsuario/:idProducto", 
    authMiddleware,
    roleMiddleware([Roles.ADMIN]),
    ActualizarDetalleCarritoAdmin
);



export default router;
