import express from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
import roleMiddleware from "../../middleware/roleMiddleware.js";

import {
  actualizarDetallePedido,
  obtenerDetallesPedidoCliente,
  insertarDetallePedido,
  obtenerPedidosCliente,
  cancelarPedidoCliente,
  aprobarPedido,
  cancelarPedidoAdministrador,
  eliminarDetallePedido
} from "../../controllers/cliente/pedido.Controller.js";

const router = express.Router();
/**
 * @route GET /api/cliente/pedido/ObtenerPedidosCliente
 * @desc Obtener todos los pedidos en Espera "4"del cliente 
 * @access Clientes
 */
router.get(
    "/ObtenerPedidosCliente", 
    authMiddleware,
    roleMiddleware([1,2]),
    obtenerPedidosCliente
);


/**
 * @route GET /api/pedido/ObtenerDetallesPedidoCliente/:id
 * @desc Obtener los detalles del pedido del usuario Cliente
 * @access Clientes
 */
router.get(
    "/ObtenerDetallesPedidoCliente/:id", 
    authMiddleware,
    roleMiddleware([1,2]),
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
    roleMiddleware([1,2]), 
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
    roleMiddleware([1,2]),
    actualizarDetallePedido
);


/**
 * @route DELETE /api/pedido/:pedidoId/EliminarDetallePedido/:productoId
 * @desc Eliminar un detalle en el pedido del usuario
 * @access Clientes
 */
router.delete(
    "/:pedidoId/EliminarDetallePedido/:productoId", 
    authMiddleware,
    roleMiddleware([1,2]),
    eliminarDetallePedido   
);

/**
 * @route PUT /api/pedido/CancelarPedidoCliente/:id
 * @desc Cancelar el pedido en estado "En proceso" del usuario
 * @access Clientes
 */
router.put(
    "/CancelarPedidoCliente/:id", 
    authMiddleware,
    roleMiddleware([1,2]), 
    cancelarPedidoCliente
);

/**
 * @route POST /api/pedido/AprobarPedido/:id
 * @desc Aprobar un pedido (Acción administrativa)
 * @access Privado (Administradores)
 */
router.post(
    "/AprobarPedido/:id", 
    authMiddleware,
    roleMiddleware([1]),  
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
  roleMiddleware([1]),
  cancelarPedidoAdministrador
);


export default router;
