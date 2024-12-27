import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

import {
    actualizarDetallePedido,
    obtenerDetallesPedidoCliente,
    insertarDetallePedido,
    obtenerPedidosCliente,
    cancelarPedidoCliente,
    aprobarPedido,
    cancelarPedidoAdministrador,
    eliminarDetallePedido
} from "../controllers/pedido.Controller.js";

import Roles from "../config/roles.js";

const router = express.Router();

// Role 1: Administrador
// Role 2: Cliente

/**
 * @route GET /api/cliente/pedido/ObtenerPedidosCliente
 * @desc Obtener todos los pedidos en Espera "4" del cliente 
 * @access Clientes y admin
 */
router.get(
        "/ObtenerPedidosCliente", 
        authMiddleware,
        roleMiddleware([Roles.ADMIN, Roles.CLIENTE]),
        obtenerPedidosCliente
);

/**
 * @route GET /api/pedido/ObtenerDetallesPedidoCliente/:id
 * @desc Obtener los detalles del pedido exacto del usuario Cliente
 * @access Clientes
 */
router.get(
        "/ObtenerDetallesPedidoCliente/:id", 
        authMiddleware,
        roleMiddleware([Roles.ADMIN, Roles.CLIENTE]),
        obtenerDetallesPedidoCliente
);

/**
 * @route POST /api/pedido/:pedidoId/InsertarDetallePedido/:productoId
 * @desc Insertar un detalle en el pedido del usuario
 * @access Clientes
 */
router.post(
        "/:pedidoId/InsertarDetallePedido/:productoId", 
        authMiddleware,
        roleMiddleware([Roles.ADMIN, Roles.CLIENTE]), 
        insertarDetallePedido
);

/**
 * @route PUT /api/pedido/:pedidoId/ActualizarDetallePedido/:productoId
 * @desc Actualizar o eliminar un detalle en el pedido del usuario
 * @access Clientes
 */
router.put(
        "/:pedidoId/ActualizarDetallePedido/:productoId", 
        authMiddleware,
        roleMiddleware([Roles.ADMIN, Roles.CLIENTE]),
        actualizarDetallePedido
);

/**
 * @route DELETE /api/pedido/:pedidoId/EliminarDetallePedido/:productoId
 * @desc Eliminar un detalle en el pedido del usuario
 * @access Clientes y admin
 */
router.delete(
        "/:pedidoId/EliminarDetallePedido/:productoId", 
        authMiddleware,
        roleMiddleware([Roles.ADMIN, Roles.CLIENTE]),
        eliminarDetallePedido   
);

/**
 * @route PUT /api/pedido/CancelarPedidoCliente/:id
 * @desc Cancelar el pedido en estado "En proceso" por parte del Cliente
 * @access Clientes y admin
 */
router.put(
        "/CancelarPedidoCliente/:id", 
        authMiddleware,
        roleMiddleware([Roles.ADMIN, Roles.CLIENTE]), 
        cancelarPedidoCliente
);

/**
 * @route POST /api/pedido/AprobarPedido/:id
 * @desc Aprobar un pedido (Acción admin)
 * @access Privado (Administradores)
 */
router.post(
        "/AprobarPedido/:id", 
        authMiddleware,
        roleMiddleware([Roles.ADMIN]),  
        aprobarPedido
);

/**
 * @route POST /api/pedido/CancelarPedidoAdmin/:id
 * @desc Cancelar un pedido como administrador
 * @access Privado (Administradores)
 */
router.post(
    "/CancelarPedidoAdmin/:id",
    authMiddleware,
    roleMiddleware([Roles.ADMIN]),
    cancelarPedidoAdministrador
);

export default router;
