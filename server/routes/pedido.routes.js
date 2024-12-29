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
    eliminarDetallePedido,
    obtenerPedidos,
    obtenerDetallesClientePorAdmin,
    obtenerPedidosClientePorAdmin,
    obtenerPedidoPorId 
} from "../controllers/pedido.Controller.js";

import Roles from "../config/roles.js";

const router = express.Router();


/**
 * @route GET /api/pedido/ObtenerPedidos 
 * @desc Obtiene todos los pedidos de la tabla pedidos
 * @access Privado (Administradores)
 */
router.get(
        "/ObtenerPedidos",
        authMiddleware,
        roleMiddleware([Roles.ADMIN]),
        obtenerPedidos
);

/**
 * @route GET /api/pedido/ObtenerPedidos 
 * @desc Obtiene todos los pedidos de la tabla pedidos
 * @access Privado (Administradores)
 */
router.get(
        "/ObtenerPedidoPorId/:id",
        authMiddleware,
        roleMiddleware([Roles.ADMIN]),
        obtenerPedidoPorId
);


    /**
 * @route GET /api/pedido/obtenerPedidosClientePorAdmin/:id
 * @desc Obtiene los Pedidos Realizados por un Cliente en especifico,  en espera "4"
 * @access Privado (Administradores)
 */
router.get(
        "/obtenerPedidosClientePorAdmin/:id",
        authMiddleware,
        roleMiddleware([Roles.ADMIN]),
        obtenerPedidosClientePorAdmin 
);

/**
 * @route GET /api/pedido/obtenerDetallesClientePorAdmin/:id
 * @desc Obtiene los detalles de un pedido de un cliente
 * @access Privado (Administradores)
 */
router.get(
        "/obtenerDetallesClientePorAdmin/:idcliente/:idpedido",
        authMiddleware,
        roleMiddleware([Roles.ADMIN]),
        obtenerDetallesClientePorAdmin
    );


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
 * @route PUT /api/pedido/AprobarPedido/:id
 * @desc Aprobar un pedido (Acción admin)
 * @access Privado (Administradores)
 */
router.put(
        "/AprobarPedido/:id", 
        authMiddleware,
        roleMiddleware([Roles.ADMIN]),  
        aprobarPedido
);

/**
 * @route PUT /api/pedido/CancelarPedidoAdmin/:id
 * @desc Cancelar un pedido como administrador
 * @access Privado (Administradores)
 */
router.put(
    "/CancelarPedidoAdmin/:id",
    authMiddleware,
    roleMiddleware([Roles.ADMIN]),
    cancelarPedidoAdministrador
);



export default router;
