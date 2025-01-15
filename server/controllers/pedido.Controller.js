import {
    obtenerPedidosSequelize,
    obtenerPedidosClienteSequelize,
    obtenerPedidoPorIdSequelize,
    obtenerDetallesPedidoClienteSequelize,
    obtenerDetallesClientePorAdminSequelize,
    actualizarDetallePedidoSequelize,
    cancelarPedidoClienteSequelize,
    aprobarPedidoSequelize,
    cancelarPedidoAdministradorSequelize,
    eliminarDetallePedidoSequelize,
    insertarDetallePedidoSequelize,
  } from '../services/pedidoService.js';

  /**
   * @description Obtener todo los pedidos del cliente actual
   * @route GET /api/pedido/ObtenerPedidosCliente
   * @access admin y cliente
   */
  export const obtenerPedidosCliente = async (req, res) => {
    try {
      const fk_cliente = req.user.id;
      const pedidos = await obtenerPedidosClienteSequelize(fk_cliente);
      return res.status(200).json(pedidos);
    } catch (error) {
      console.error('Error al obtener pedidos del cliente:', error);
      return res.status(500).json({ error: 'Error interno del servidor.' });
    }
  };
  
  /**
   * @description Obtener un pedido por su ID especifico
   * @route GET /api/pedido/ObtenerPedidoPorId/:id
   * @access admin
   */
  export const obtenerPedidoPorId = async (req, res) => {
    const { id } = req.params;
    const pk_id_pedido = Number(id);

    try {
      const pedido = await obtenerPedidoPorIdSequelize(pk_id_pedido);
      if (!pedido) {
        return res.status(404).json({ error: 'Pedido no encontrado.' });
      }
      return res.status(200).json(pedido);
    } catch (error) {
      console.error('Error al obtener pedido por ID:', error);
      return res.status(500).json({ error: 'Error interno del servidor.' });
    }
  };
  
  /**
   * @description Obtener pedidos de un cliente (ID en req.params) por admin
   * @route GET /api/pedido/obtenerPedidosClientePorAdmin/:id
   * @access [ADMIN]
   */
  export const obtenerPedidosClientePorAdmin = async (req, res) => {
    const {id} = req.params;
    const fk_cliente = Number(id); // ID del cliente
    try {
      const pedidos = await obtenerPedidosClienteSequelize(fk_cliente);
      return res.status(200).json(pedidos);
    } catch (error) {
      console.error('Error al obtener pedidos del cliente por admin:', error);
      return res.status(500).json({ error: 'Error interno del servidor.' });
    }
  };
  
  /**
   * @description Obtener todos los pedidos 
   * @route GET /api/pedido/ObtenerPedidos
   * @access admin
   */
  export const obtenerPedidos = async (req, res) => {
    try {
      const pedidos = await obtenerPedidosSequelize();
      return res.status(200).json(pedidos);
    } catch (error) {
      console.error('Error al obtener pedidos:', error);
      return res.status(500).json({ error: 'Error interno del servidor.' });
    }
  };
  
  /**
   * @description Obtiene los detalles de un pedido especifico del cliente actual (req.user.id)
   * @route GET /api/pedido/ObtenerDetallesPedidoCliente/:id
   * @access admin y cliente
   */
  export const obtenerDetallesPedidoCliente = async (req, res) => {
    try {
      const fk_id_usuario = req.user.id;
      const {id} = req.params;
      const pk_id_pedido = Number(id);
  
      const detalles = await obtenerDetallesPedidoClienteSequelize(fk_id_usuario, pk_id_pedido);
      return res.status(200).json(detalles);
    } catch (error) {
      console.error('Error al obtener detalles del pedido del cliente:', error);
      // Manejo de error.number para emular SP
      if (error.number === 50000) {
        return res.status(404).json({ error: 'No existe un pedido en estado "En proceso" para este usuario.' });
      }
      return res.status(500).json({ error: 'Error interno del servidor.' });
    }
  };
  
  /**
   * @description Obtiene los detalles de un pedido de un cliente (fk_id_usuario) por un admin, sin importar estado
   * @route GET /api/pedido/obtenerDetallesClientePorAdmin/:idcliente/:idpedido
   * @access admin
   */
  export const obtenerDetallesClientePorAdmin = async (req, res) => {
    const {idcliente, idpedido} = req.params;
    const fk_id_usuario = Number(idcliente); // ID del cliente
    const pk_id_pedido = Number(idpedido); // ID del pedido

    try {
      const detalles = await obtenerDetallesClientePorAdminSequelize(fk_id_usuario, pk_id_pedido);
      return res.status(200).json(detalles);
    } catch (error) {
      console.error('Error al obtener detalles del pedido del cliente por admin:', error);
      if (error.number === 50000) {
        return res.status(404).json({ error: 'No existe un pedido para ese usuario con ese ID.' });
      }
      return res.status(500).json({ error: 'Error interno del servidor.' });
    }
  };
  
  /**
   * @description Actualiza o elimina un detalle (si nueva_cantidad=0) en el pedido del usuario
   * @route PUT /api/pedido/:pedidoId/ActualizarDetallePedido/:productoId
   * @access [CLIENTE, ADMIN]
   */
  export const actualizarDetallePedido = async (req, res) => {
    try {
      const { nueva_cantidad } = req.body;
      const fk_id_usuario = req.user.id;
      const fk_id_pedido = parseInt(req.params.pedidoId, 10);
      const fk_id_producto = parseInt(req.params.productoId, 10);
  
      if (isNaN(nueva_cantidad)) {
        return res.status(400).json({
          message: 'Datos inválidos. Cantidad numérica requerida.',
        });
      }
  
      await actualizarDetallePedidoSequelize({
        fk_id_usuario,
        fk_id_pedido,
        fk_id_producto,
        nueva_cantidad,
      });
  
      return res.status(200).json({
        message: nueva_cantidad === 0
          ? 'Detalle del pedido eliminado exitosamente.'
          : 'Detalle del pedido actualizado exitosamente.',
      });
    } catch (error) {
      console.error('Error al actualizar/eliminar detalle del pedido:', error);
      if (error.number === 50000) {
        return res.status(404).json({ error: 'No existe un pedido en estado "En proceso" para este usuario.' });
      } else if (error.number === 50003) {
        return res.status(400).json({ error: 'La cantidad no puede ser negativa.' });
      } else if (error.number === 50004) {
        return res.status(404).json({ error: 'El producto especificado no existe en el pedido.' });
      }
      return res.status(500).json({ error: 'Error interno del servidor.' });
    }
  };
  
  /**
   * @description Elimina un detalle (similar a cantidad=0) en el pedido del usuario
   * @route DELETE /api/pedido/:pedidoId/EliminarDetallePedido/:productoId
   * @access [CLIENTE, ADMIN]
   */
  export const eliminarDetallePedido = async (req, res) => {
    try {
      const fk_id_usuario = req.user.id;
      const fk_id_pedido = parseInt(req.params.pedidoId, 10);
      const fk_id_producto = parseInt(req.params.productoId, 10);
  
      await eliminarDetallePedidoSequelize({ fk_id_usuario, fk_id_pedido, fk_id_producto });
      return res.status(200).json({
        message: 'Detalle del pedido eliminado exitosamente.',
      });
    } catch (error) {
      console.error('Error al eliminar detalle del pedido:', error);
      if (error.number === 50000) {
        return res.status(404).json({ error: 'No existe un pedido en estado "En proceso" para este usuario.' });
      } else if (error.number === 50002) {
        return res.status(404).json({ error: 'El producto especificado no existe en el pedido.' });
      }
      return res.status(500).json({ error: 'Error interno del servidor.' });
    }
  };
  
  /**
   * @description Cancelar un pedido "En proceso" por parte del cliente (estado=4 => 7)
   * @route PUT /api/pedido/CancelarPedidoCliente/:id
   * @access [CLIENTE, ADMIN]
   */
  export const cancelarPedidoCliente = async (req, res) => {
    try {
      const fk_id_cliente = req.user.id;
      const {id} = req.params;
      const fk_id_pedido = Number(id);
  
      await cancelarPedidoClienteSequelize({ fk_id_cliente, fk_id_pedido });
      return res.status(200).json({ message: 'Pedido cancelado exitosamente.' });
    } catch (error) {
      console.error('Error al cancelar el pedido:', error);
      if (error.number === 50000) {
        return res.status(404).json({ error: 'No existe un pedido en estado "En proceso" para este usuario.' });
      }
      return res.status(500).json({ error: 'Error interno del servidor.' });
    }
  };
  
  /**
   * @description Aprobar un pedido (admin). Pasa de "En proceso"(4) a "Completado"(5)
   * @route PUT /api/pedido/AprobarPedido/:id
   * @access admin
   */
  export const aprobarPedido = async (req, res) => {
    const {id} = req.params;
    const pk_id_pedido = Number(id); // ID del pedido
    const fk_id_usuario_operacion = req.user.id; // ID del admin

    try {
      await aprobarPedidoSequelize({ pk_id_pedido, fk_id_usuario_operacion });
      return res.status(200).json({ message: 'Pedido aprobado exitosamente.' });
    } catch (error) {
      console.error('Error al aprobar el pedido:', error);
      if (error.number === 50000) {
        return res.status(404).json({ error: 'El pedido especificado no existe o no está en proceso.' });
      }
      return res.status(500).json({ error: 'Error interno del servidor.' });
    }
  };
  
  /**
   * @description Cancelar un pedido (admin). Pasa de "En proceso"(4) a "Cancelado por Admin"(6).
   * @route PUT /api/pedido/CancelarPedidoAdmin/:id
   * @access [ADMIN]
   */
  export const cancelarPedidoAdministrador = async (req, res) => {
    const {id} = req.params;
    const pk_id_pedido = Number(id);
    const fk_id_usuario_operacion = req.user.id;

    try {
      await cancelarPedidoAdministradorSequelize({ pk_id_pedido, fk_id_usuario_operacion });
      return res.status(200).json({ message: 'Pedido cancelado exitosamente.' });
    } catch (error) {
      console.error('Error al cancelar pedido como admin:', error);
      if (error.number === 50000) {
        return res.status(404).json({ error: 'El pedido especificado no existe o no está en proceso.' });
      }
      return res.status(500).json({ error: 'Error interno del servidor.' });
    }
  };
  
  /**
   * @description Inserta un detalle en el pedido del usuario (estado=4)
   * @route POST /api/pedido/:pedidoId/InsertarDetallePedido/:productoId
   * @access [CLIENTE]
   */
  export const insertarDetallePedido = async (req, res) => {
    try {
      const fk_id_usuario = req.user.id;
      const fk_id_pedido = parseInt(req.params.pedidoId, 10);
      const fk_id_producto = parseInt(req.params.productoId, 10);
      const { cantidad } = req.body;
  
      if (isNaN(cantidad)) {
        return res.status(400).json({
          message: 'Datos inválidos. Asegúrate de proporcionar un ID de producto válido y una cantidad numérica.',
        });
      }
  
      await insertarDetallePedidoSequelize({ fk_id_usuario, fk_id_pedido, fk_id_producto, cantidad });
      return res.status(201).json({ message: 'Detalle del pedido insertado exitosamente.' });
    } catch (error) {
      console.error('Error al insertar detalle del pedido:', error);
      if (error.number === 50000) {
        return res.status(404).json({ error: 'No existe un pedido en estado "En proceso" para este usuario.' });
      } else if (error.number === 50002) {
        return res.status(404).json({ error: 'El producto especificado no existe o no está activo.' });
      } else if (error.number === 50003) {
        return res.status(400).json({ error: 'La cantidad debe ser mayor a cero.' });
      }
      return res.status(500).json({ error: 'Error interno del servidor.' });
    }
  };
  