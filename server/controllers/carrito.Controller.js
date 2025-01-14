import {
    obtenerDetallesCarritoPorUsuarioSequelize,
    agregarProductoAlCarritoSequelize,
    eliminarDetalleCarritoSequelize,
    eliminarDetallesCarritoSequelize,
    actualizarDetalleCarritoSequelize,
    confirmarCarritoSequelize,
  } from '../services/carritoService.js';
  
  /**
   * @description Obtener detalles del carrito para el cliente en sesión
   * @route GET /api/carrito/ObtenerDetallesCarritoPorUsuario
   * @access Cliente
   */
  export const obtenerDetallesCarritoPorUsuario = async (req, res) => {
    const fk_id_usuario = Number(req.user.id);
  
    try {
      const detalles = await obtenerDetallesCarritoPorUsuarioSequelize(fk_id_usuario);
      res.json(detalles);
    } catch (error) {
      console.error('Error obteniendo detalles del carrito (Sequelize):', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  };
  
  /**
   * @description Obtener detalles del carrito para un usuario especifico (ADMIN)
   * @route GET /api/carrito/ObtenerDetallesCarritoPorUsuario/:id
   * @access Admin
   */
  export const obtenerDetallesCarritoPorUsuarioAdmin = async (req, res) => {
    const fk_id_usuario = Number(req.params.id); // ID desde la URL
  
    try {
      const detalles = await obtenerDetallesCarritoPorUsuarioSequelize(fk_id_usuario);
      res.json(detalles);
    } catch (error) {
      console.error('Error obteniendo detalles del carrito (Sequelize):', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  };
  
  /**
   * @description Agregar un producto al carrito (usuario en sesión)
   * @route POST /api/carrito/AgregarProductoAlCarrito/:id
   * @access Cliente
   */
  export const AgregarProductoAlCarrito = async (req, res) => {
    const { cantidad } = req.body;
    const pk_id_producto = Number(req.params.id);
    const fk_id_usuario = Number(req.user.id);
  
    if (!fk_id_usuario || !pk_id_producto || !cantidad) {
      return res.status(400).json({ message: 'Faltan campos obligatorios.' });
    }
  
    try {
      await agregarProductoAlCarritoSequelize({
        fk_id_usuario,
        pk_id_producto,
        cantidad
      });
      res.json({ message: 'Producto agregado al carrito.' });
    } catch (error) {
      console.error('Error agregando producto al carrito (Sequelize):', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  };
  
  /**
   * @description Agregar un producto al carrito de un usuario específico (ADMIN)
   * @route POST /api/carrito/AgregarProductoAlCarritoAdmin/:idUsuario/:idProducto
   * @access Admin
   */
  export const AgregarProductoAlCarritoAdmin = async (req, res) => {
    const { idUsuario, idProducto } = req.params;
    const pk_id_producto = Number(idProducto);
    const fk_id_usuario = Number(idUsuario);
    const { cantidad } = req.body;
  
    if (!fk_id_usuario || !pk_id_producto || !cantidad) {
      return res.status(400).json({ message: 'Faltan campos obligatorios.' });
    }
  
    try {
      await agregarProductoAlCarritoSequelize({
        fk_id_usuario,
        pk_id_producto,
        cantidad
      });
      res.json({ message: 'Producto agregado al carrito.' });
    } catch (error) {
      console.error('Error agregando producto al carrito (Sequelize):', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  };
  
  /**
   * @description Eliminar un detalle específico del carrito (usuario en sesión)
   * @route DELETE /api/carrito/EliminarDetalleCarrito/:id
   * @access Cliente
   */
  export const EliminarDetalleCarrito = async (req, res) => {
    const fk_id_producto = Number(req.params.id);
    const fk_id_usuario = Number(req.user.id);
  
    if (!fk_id_producto || !fk_id_usuario) {
      return res.status(400).json({ message: 'Faltan campos obligatorios.' });
    }
  
    try {
      await eliminarDetalleCarritoSequelize({
        fk_id_producto,
        fk_id_usuario
      });
      res.json({ message: 'Detalle del carrito eliminado.' });
    } catch (error) {
      console.error('Error eliminando detalle del carrito (Sequelize):', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  };
  
  /**
   * @description Eliminar un detalle específico del carrito para un cliente especifico (ADMIN)
   * @route DELETE /api/carrito/EliminarDetalleCarritoAdmin/:idUsuario/:idProducto
   * @access Admin
   */
  export const EliminarDetalleCarritoAdmin = async (req, res) => {
    const fk_id_usuario = Number(req.params.idUsuario);
    const fk_id_producto = Number(req.params.idProducto);
  
    if (!fk_id_usuario || !fk_id_producto) {
      return res.status(400).json({ message: 'Faltan campos obligatorios.' });
    }
  
    try {
      await eliminarDetalleCarritoSequelize({
        fk_id_producto,
        fk_id_usuario
      });
      res.json({ message: 'Detalle del carrito eliminado.' });
    } catch (error) {
      console.error('Error eliminando detalle del carrito (Sequelize):', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  };
  
  /**
   * @description Eliminar todos los detalles del carrito (usuario en sesión)
   * @route DELETE /api/carrito/EliminarDetallesCarrito
   * @access Cliente
   */
  export const EliminarDetallesCarrito = async (req, res) => {
    const fk_id_usuario = Number(req.user.id);
  
    try {
      await eliminarDetallesCarritoSequelize(fk_id_usuario);
      res.json({ message: 'Todos los detalles del carrito eliminados.' });
    } catch (error) {
      console.error('Error eliminando todos los detalles del carrito (Sequelize):', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  };
  
  /**
   * @description Eliminar todos los detalles del carrito (ADMIN) - para un usuario específico
   * @route DELETE /api/carrito/EliminarDetallesCarritoAdmin/:id
   * @access Admin
   */
  export const EliminarDetallesCarritoAdmin = async (req, res) => {
    const fk_id_usuario = Number(req.params.id);
  
    try {
      await eliminarDetallesCarritoSequelize(fk_id_usuario);
      res.json({ message: 'Todos los detalles del carrito eliminados.' });
    } catch (error) {
      console.error('Error eliminando todos los detalles del carrito (Sequelize):', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  };
  
  /**
   * @description Actualizar un detalle del carrito (usuario en sesión)
   * @route PUT /api/carrito/ActualizarDetalleCarrito/:id
   * @access Cliente
   */
  export const ActualizarDetalleCarrito = async (req, res) => {
    const { nueva_cantidad } = req.body;
    const fk_id_producto = Number(req.params.id);
    const fk_id_usuario = Number(req.user.id);
  
    if (!fk_id_usuario || !fk_id_producto || nueva_cantidad === undefined) {
      return res.status(400).json({ message: 'Faltan campos obligatorios.' });
    }
  
    try {
      await actualizarDetalleCarritoSequelize({
        fk_id_usuario,
        fk_id_producto,
        nueva_cantidad
      });
      res.json({ message: 'Detalle del carrito actualizado.' });
    } catch (error) {
      console.error('Error actualizando detalle del carrito (Sequelize):', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  };
  
  /**
   * @description Actualizar un detalle del carrito (ADMIN) para un usuario específico
   * @route PUT /api/carrito/ActualizarDetalleCarritoAdmin/:idUsuario/:idProducto
   * @access Admin
   */
  export const ActualizarDetalleCarritoAdmin = async (req, res) => {
    const { nueva_cantidad } = req.body;
    const fk_id_usuario = Number(req.params.idUsuario);
    const fk_id_producto = Number(req.params.idProducto);
  
    if (!fk_id_usuario || !fk_id_producto || isNaN(nueva_cantidad)) {
      return res.status(400).json({ message: 'Faltan campos obligatorios.' });
    }
  
    try {
      await actualizarDetalleCarritoSequelize({
        fk_id_usuario,
        fk_id_producto,
        nueva_cantidad
      });
      res.json({ message: 'Detalle del carrito actualizado.' });
    } catch (error) {
      console.error('Error actualizando detalle del carrito (Sequelize):', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  };
  
  /**
   * @description Confirmar el carrito (usuario en sesión) => convertir en Pedido
   * @route PUT /api/carrito/ConfirmarCarrito
   * @access Cliente
   */
  export const ConfirmarCarrito = async (req, res) => {
    const fk_id_usuario = Number(req.user.id);
  
    if (!fk_id_usuario) {
      return res.status(400).json({ message: 'Faltan campos obligatorios.' });
    }
  
    try {
      await confirmarCarritoSequelize(fk_id_usuario);
      res.json({ message: 'Carrito confirmado.' });
    } catch (error) {
      console.error('Error confirmando carrito (Sequelize):', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  };
  