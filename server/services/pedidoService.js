import sequelize from '../config/dbSequelize.js';
import Pedido from '../models/Pedido.js';
import DetallePedido from '../models/DetallePedido.js';
import Producto from '../models/Producto.js';
import Log from '../models/Log.js';
import Estados from '../config/estados.js';

/**
 * @description Obtiene la lista de todos los pedidos 
 * @returns {Promise<Array>} - Lista de pedidos encontrados
 * @access Accesible para Admin 
 * */
export const obtenerPedidosSequelize = async () => {
    const pedidos = await Pedido.findAll();
    return pedidos;
};

/**
 * @description Obtiene la lista de pedidos del cliente actual o especificado por admin
 * @param {number} fk_cliente - ID del cliente
 * @returns {Promise<Array>} - Lista de pedidos encontrados
 */
export const obtenerPedidosClienteSequelize = async (fk_cliente) => {
  const t = await sequelize.transaction();
  try {

    // Buscar los pedidos de este cliente
    const pedidos = await Pedido.findAll({
      where: { fk_cliente },
      order: [['pk_id_pedido', 'DESC']],
      transaction: t,
    });

    // Registrar en Log
    await Log.create({
      // fechaHora: new Date() (Si tu BD no lo setea por defecto)
      fk_id_usuario: fk_cliente,
      entidadAfectada: 'Pedidos',
      operacion: 'SELECT',
      detalles: `Se obtuvieron ${pedidos.length} pedidos para el Cliente ID: ${fk_cliente}`,
      resultado: 'Éxito',
    }, { transaction: t });

    await t.commit();
    return pedidos;
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

/**
 * @description Obtiene un pedido por su ID específico
 * @param {number} pk_id_pedido - ID del pedido
 * @returns {Promise<Pedido|null>} - El pedido, o null si no existe
 */
export const obtenerPedidoPorIdSequelize = async (pk_id_pedido) => {
  const pedido = await Pedido.findOne({
    where: { pk_id_pedido },
  });
  return pedido;
};

/**
 * @description Obtiene los detalles de un pedido de un cliente.
 * @param {number} fk_id_usuario - ID del cliente (req.user.id)
 * @param {number} pk_id_pedido  - ID del pedido
 * @returns {Promise<Array>} - Detalles del pedido (DetallePedido)
 */
export const obtenerDetallesPedidoClienteSequelize = async (fk_id_usuario, pk_id_pedido) => {
  // Buscar el pedido y sus Detalles
  const pedido = await Pedido.findOne({
    where: {
      pk_id_pedido,
      fk_cliente: fk_id_usuario,
    },
    include: [
      {
        model: DetallePedido,
        include: {
          model: Producto,
          as: 'ProductoDetallePedido',
          attributes: ['nombre', 'stock'],
        }
      }
    ],

  });
  if (!pedido) {
    const err = new Error('No existe un pedido para este usuario.');
    err.number = 50000; 
    throw err;
  }
  return pedido.Detalle_Pedidos;
};

/**
 * @description Obtiene los detalles de un pedido de un cliente, sin importar su estado.
 * @param {number} fk_id_usuario - ID del cliente
 * @param {number} pk_id_pedido  - ID del pedido
 * @returns {Promise<Array>} - Detalles del pedido
 */
export const obtenerDetallesClientePorAdminSequelize = async (fk_id_usuario, pk_id_pedido) => {
  const pedido = await Pedido.findOne({
    where: { fk_cliente: fk_id_usuario, pk_id_pedido },
    include: [
      {
        model: DetallePedido,
        include: {
          model: Producto,
          as: 'ProductoDetallePedido',
          attributes: ['nombre' , 'stock' , 'descripcion', ],
        }
      }
    ],
  });
  if (!pedido) {
    const err = new Error('No existe un pedido para este usuario con ese ID.');
    err.number = 50000; 
    throw err;
  }
  return {
    total: pedido.total,
    fecha_pedido: pedido.fecha_pedido,
    estado: pedido.fk_estado,            // si lo necesitas
    Detalle_Pedidos: pedido.Detalle_Pedidos,
  };
};

/**
 * @description Actualiza un detalle en el pedido (o lo elimina si nueva_cantidad=0). Similar a SP ActualizarDetallePedido.
 * @param {Object} data
 * @param {number} data.fk_id_usuario
 * @param {number} data.fk_id_pedido
 * @param {number} data.fk_id_producto
 * @param {number} data.nueva_cantidad
 * @throws {Error} - Diferentes códigos de error si no existe pedido en estado "En proceso", etc.
 */
export const actualizarDetallePedidoSequelize = async ({
  fk_id_usuario,
  fk_id_pedido,
  fk_id_producto,
  nueva_cantidad,
}) => {
  const t = await sequelize.transaction();
  try {
    // 1. Verificar que el pedido esté EN_PROCESO (4) y pertenezca al usuario
    const pedido = await Pedido.findOne({
      where: { pk_id_pedido: fk_id_pedido, fk_cliente: fk_id_usuario, fk_estado: Estados.EN_PROCESO },
      transaction: t,
    });
    if (!pedido) {
      const err = new Error('No existe un pedido en estado "En proceso" para este usuario.');
      err.number = 50000;
      throw err;
    }

    // 2. Buscar el detalle
    const detalle = await DetallePedido.findOne({
      where: { fk_id_pedido, fk_id_producto },
      transaction: t,
    });
    if (!detalle) {
      // Emular error 50002 / 50003...
      const err = new Error('El producto no existe en el pedido.');
      err.number = 50004;
      throw err;
    }

    // 3. Validar cantidad
    if (nueva_cantidad < 0) {
      const err = new Error('La cantidad no puede ser negativa.');
      err.number = 50003;
      throw err;
    }

    // 4. Si nueva_cantidad=0 => Eliminar
    if (nueva_cantidad === 0) {
      await detalle.destroy({ transaction: t });

      // Log
      await Log.create({
        fk_id_usuario,
        entidadAfectada: 'Detalle_Pedido',
        operacion: 'DELETE',
        detalles: `Detalle eliminado del pedido ${fk_id_pedido}, producto ${fk_id_producto}`,
        resultado: 'Éxito',
      }, { transaction: t });
    } else {
      // Actualizar la cantidad y el subtotal
      const precioUnit = detalle.precio_unitario;
      const subtotal = precioUnit * nueva_cantidad;
      await detalle.update({
        cantidad: nueva_cantidad,
        subtotal,
      }, { transaction: t });

      await Log.create({
        fk_id_usuario,
        entidadAfectada: 'Detalle_Pedido',
        operacion: 'UPDATE',
        detalles: `Detalle actualizado: pedido ${fk_id_pedido}, producto ${fk_id_producto}, cantidad=${nueva_cantidad}, subtotal=${subtotal}`,
        resultado: 'Éxito',
      }, { transaction: t });
    }

    // 5. Recalcular total
    const detalles = await DetallePedido.findAll({
      where: { fk_id_pedido },
      transaction: t,
    });
    const nuevoTotal = detalles.reduce((acc, d) => acc + Number(d.subtotal), 0);
    await pedido.update({ total: nuevoTotal }, { transaction: t });

    await t.commit();
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

/**
 * @description El cliente cancela un pedido en estado "En proceso"(4) => CANCELADO_POR_CLIENTE(7).
 * @param {Object} data
 * @param {number} data.fk_id_cliente - ID del cliente
 * @param {number} data.fk_id_pedido  - ID del pedido
 */
export const cancelarPedidoClienteSequelize = async ({ fk_id_cliente, fk_id_pedido }) => {
  const t = await sequelize.transaction();
  try {
    // Buscar pedido en estado "En proceso" (4)
    const pedido = await Pedido.findOne({
      where: { pk_id_pedido: fk_id_pedido, fk_cliente: fk_id_cliente, fk_estado: Estados.EN_PROCESO },
      include: [{ model: DetallePedido, include: [{model: Producto, as: 'ProductoDetallePedido'}] }],
      transaction: t,
    });
    if (!pedido) {
      const err = new Error('No existe un pedido en estado "En proceso" para este usuario.');
      err.number = 50000;
      throw err;
    }

    // Restaurar stock de productos
    for (const det of pedido.Detalle_Pedidos) {
      const producto = det.ProductoDetallePedido;
      await producto.update({ stock: producto.stock + det.cantidad }, { transaction: t });
    }

    // Cambiar estado => CANCELADO_POR_CLIENTE (7)
    await pedido.update({ fk_estado: Estados.CANCELADO_POR_CLIENTE }, { transaction: t });

    // Log
    await Log.create({
      fk_id_usuario: fk_id_cliente,
      entidadAfectada: 'Pedidos',
      operacion: 'UPDATE',
      detalles: `Pedido ${fk_id_pedido} cancelado por Cliente ID: ${fk_id_cliente}, total=${pedido.total}`,
      resultado: 'Éxito',
    }, { transaction: t });

    // Registrar stock en Log
    for (const det of pedido.Detalle_Pedidos) {
      await Log.create({
        fk_id_usuario: fk_id_cliente,
        entidadAfectada: 'Productos',
        operacion: 'UPDATE',
        detalles: `Stock actualizado por cancelación del pedido ID:${fk_id_pedido}, producto=${det.fk_id_producto}, cantidad devuelta=${det.cantidad}`,
        resultado: 'Éxito',
      }, { transaction: t });
    }

    await t.commit();
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

/**
 * @description Aprueba un pedido (admin) => pasa de "En proceso"(4) a "Completado"(5).
 * @param {Object} data
 * @param {number} data.pk_id_pedido
 * @param {number} data.fk_id_usuario_operacion - ID del admin
 */
export const aprobarPedidoSequelize = async ({ pk_id_pedido, fk_id_usuario_operacion }) => {
  const t = await sequelize.transaction();
  try {
    // Buscar pedido en estado EN_PROCESO
    const pedido = await Pedido.findOne({
      where: { pk_id_pedido, fk_estado: Estados.EN_PROCESO },
      transaction: t,
    });
    if (!pedido) {
      const err = new Error('El pedido especificado no existe o no está en proceso.');
      err.number = 50000;
      throw err;
    }

    // Estado => CONFIRMADO_POR_ADMIN (5) [o "Completado"]
    await pedido.update({ fk_estado: Estados.CONFIRMADO_POR_ADMIN }, { transaction: t });

    // Log
    await Log.create({
      fk_id_usuario: fk_id_usuario_operacion,
      entidadAfectada: 'Pedidos',
      operacion: 'UPDATE',
      detalles: `Pedido ${pk_id_pedido} aprobado por admin ${fk_id_usuario_operacion}, total=${pedido.total}`,
      resultado: 'Éxito',
    }, { transaction: t });

    await t.commit();
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

/**
 * @description Cancela un pedido en estado "En proceso"(4) como administrador => CANCELADO_POR_ADMIN(6).
 * @param {Object} data
 * @param {number} data.pk_id_pedido
 * @param {number} data.fk_id_usuario_operacion
 */
export const cancelarPedidoAdministradorSequelize = async ({
  pk_id_pedido,
  fk_id_usuario_operacion,
}) => {
  const t = await sequelize.transaction();
  try {
    const pedido = await Pedido.findOne({
      where: { pk_id_pedido, fk_estado: Estados.EN_PROCESO },
      include: [{ model: DetallePedido, include: [{model:Producto , as: 'ProductoDetallePedido'}] }],
      transaction: t,
    });
    if (!pedido) {
      const err = new Error('El pedido no existe o no está en proceso.');
      err.number = 50000;
      throw err;
    }
    // Restaurar stock
    for (const det of pedido.Detalle_Pedidos) {
      const prod = det.ProductoDetallePedido;
      await prod.update({ stock: prod.stock + det.cantidad }, { transaction: t });
    }

    // Actualizar estado => CANCELADO_POR_ADMIN (6)
    await pedido.update({ fk_estado: Estados.CANCELADO_POR_ADMIN }, { transaction: t });
    
    // Log
    await Log.create({
      fk_id_usuario: fk_id_usuario_operacion,
      entidadAfectada: 'Pedidos',
      operacion: 'UPDATE',
      detalles: `Pedido ${pk_id_pedido} cancelado por Admin ${fk_id_usuario_operacion}, total=${pedido.total}`,
      resultado: 'Éxito',
    }, { transaction: t });

    // Log para productos
    for (const det of pedido.Detalle_Pedidos) {
      await Log.create({
        fk_id_usuario: fk_id_usuario_operacion,
        entidadAfectada: 'Productos',
        operacion: 'UPDATE',
        detalles: `Stock restaurado por cancelación (admin). Pedido=${pk_id_pedido}, prod=${det.fk_id_producto}, cant=${det.cantidad}`,
        resultado: 'Éxito',
      }, { transaction: t });
    }

    await t.commit();
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

/**
 * @description Elimina un detalle en el pedido del usuario (similar a SP EliminarDetallePedido).
 * @param {Object} data
 * @param {number} data.fk_id_usuario
 * @param {number} data.fk_id_pedido
 * @param {number} data.fk_id_producto
 */
export const eliminarDetallePedidoSequelize = async ({
  fk_id_usuario,
  fk_id_pedido,
  fk_id_producto,
}) => {
  const t = await sequelize.transaction();
  try {
    const pedido = await Pedido.findOne({
      where: { pk_id_pedido, fk_cliente: fk_id_usuario, fk_estado: Estados.EN_PROCESO },
      include: [{ model: DetallePedido, include: [Producto] }],
      transaction: t,
    });
    if (!pedido) {
      const err = new Error('No existe un pedido en proceso para este usuario.');
      err.number = 50000; 
      throw err;
    }

    const detalle = await DetallePedido.findOne({
      where: { fk_id_pedido, fk_id_producto },
      transaction: t,
    });
    if (!detalle) {
      const err = new Error('El producto no existe en el pedido.');
      err.number = 50002;
      throw err;
    }

    const { cantidad, subtotal } = detalle;
    await detalle.destroy({ transaction: t });

    // Recalcular total
    const restantes = await DetallePedido.findAll({
      where: { fk_id_pedido },
      transaction: t,
    });
    const nuevoTotal = restantes.reduce((acc, d) => acc + Number(d.subtotal), 0);
    await pedido.update({ total: nuevoTotal }, { transaction: t });

    // Log
    await Log.create({
      fk_id_usuario,
      entidadAfectada: 'Detalle_Pedido',
      operacion: 'DELETE',
      detalles: `Detalle eliminado: pedido ${fk_id_pedido}, producto ${fk_id_producto}, cant=${cantidad}, subt=${subtotal}`,
      resultado: 'Éxito',
    }, { transaction: t });

    await t.commit();
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

/**
 * @description Inserta un detalle en el pedido del usuario (similar a SP InsertarDetallePedido).
 * @param {Object} data
 * @param {number} data.fk_id_usuario
 * @param {number} data.fk_id_pedido
 * @param {number} data.fk_id_producto
 * @param {number} data.cantidad
 */
export const insertarDetallePedidoSequelize = async ({
  fk_id_usuario,
  fk_id_pedido,
  fk_id_producto,
  cantidad,
}) => {
  const t = await sequelize.transaction();
  try {
    // Verificar pedido en proceso
    const pedido = await Pedido.findOne({
      where: { pk_id_pedido: fk_id_pedido, fk_cliente: fk_id_usuario, fk_estado: Estados.EN_PROCESO },
      include: [DetallePedido],
      transaction: t,
    });
    if (!pedido) {
      const err = new Error('No existe un pedido en estado "En proceso" para este usuario.');
      err.number = 50000;
      throw err;
    }

    // Verificar producto activo
    const producto = await Producto.findOne({
      where: { pk_id_producto: fk_id_producto, fk_estado: Estados.ACTIVO },
      transaction: t,
    });
    if (!producto) {
      const err = new Error('El producto especificado no existe o no está activo.');
      err.number = 50002;
      throw err;
    }

    if (cantidad <= 0) {
      const err = new Error('La cantidad debe ser mayor a cero.');
      err.number = 50003;
      throw err;
    }

    const precio_unitario = producto.precio;
    const subtotal = precio_unitario * cantidad;

    await DetallePedido.create({
      fk_id_pedido,
      fk_id_producto,
      precio_unitario,
      cantidad,
      subtotal,
    }, { transaction: t });

    // Recalcular total
    const detalles = [...pedido.Detalle_Pedidos];
    detalles.push({ subtotal });
    const nuevoTotal = detalles.reduce((acc, d) => acc + Number(d.subtotal), 0);

    // O también vuelve a consultar con findAll(...) 
    await pedido.update({ total: nuevoTotal }, { transaction: t });

    // Log
    await Log.create({
      fk_id_usuario,
      entidadAfectada: 'Detalle_Pedido',
      operacion: 'INSERT',
      detalles: `Se insertó un detalle en Pedido ${fk_id_pedido}, prod=${fk_id_producto}, cant=${cantidad}, subtotal=${subtotal}`,
      resultado: 'Éxito',
    }, { transaction: t });

    await t.commit();
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

// Exportar todo como default
export default {
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
};
