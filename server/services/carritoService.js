import Carrito from '../models/Carrito.js';
import DetalleCarrito from '../models/DetalleCarrito.js';
import Producto from '../models/Producto.js';
import Log from '../models/Log.js';
import Estados from '../config/estados.js';
import sequelize from '../config/dbSequelize.js';
import Pedido from '../models/Pedido.js';
import DetallePedido from '../models/DetallePedido.js';
/**
 * @description Obtener el detalle del carrito pendiente de un usuario.
 * @param {number} fk_id_usuario - ID del usuario
 * @returns {Promise<Array>} - Lista de detalles de carrito
 */
export const obtenerDetallesCarritoPorUsuarioSequelize = async (fk_id_usuario) => {
  try {
    // Buscar un carrito en estado pendiente (3)
    const carritoPendiente = await Carrito.findOne({
      where: {
        fk_id_usuario,
        fk_estado: Estados.PENDIENTE, // 3
      },
      include: [{ model: DetalleCarrito }],
    });

    if (!carritoPendiente) {
      // No hay carrito pendiente => retornar vacío
      return [];
    }

    // Retornar los registros de DetalleCarrito
    const detalles = await DetalleCarrito.findAll({
      where: { fk_id_carrito: carritoPendiente.pk_id_carrito },
    });
    return detalles;
  } catch (error) {
    throw error;
  }
};

/**
 * @description Agregar un producto al carrito del usuario. Si no existe carrito pendiente, crear uno.
 * @param {Object} data - { fk_id_usuario, pk_id_producto, cantidad }
 */
export const agregarProductoAlCarritoSequelize = async (data) => {
  const { fk_id_usuario, pk_id_producto, cantidad } = data;

  const t = await sequelize.transaction();
  try {
    // 1. Buscar o crear un Carrito pendiente
    let carritoPendiente = await Carrito.findOne({
      where: {
        fk_id_usuario,
        fk_estado: Estados.PENDIENTE, // 3
      },
      transaction: t,
    });

    // Si no existe, crear uno
    if (!carritoPendiente) {
      carritoPendiente = await Carrito.create({
        fk_id_usuario,
        //fecha se crea automáticamente,
        total: 0,
        fk_estado: Estados.PENDIENTE,
      }, { transaction: t });
      // Registrar en Log
      await Log.create({
        fk_id_usuario,
        entidadAfectada: 'Carrito',
        operacion: 'INSERT',
        detalles: `Nuevo carrito creado con pk_id_carrito=${carritoPendiente.pk_id_carrito}`,
        resultado: 'Éxito',
      }, { transaction: t });
    }
  
    // 2. Verificar existencia del producto
    const producto = await Producto.findByPk(pk_id_producto, { transaction: t });
    if (!producto) {
      // Registrar error en Log
      await Log.create({
        fk_id_usuario,
        entidadAfectada: 'Productos',
        operacion: 'SELECT',
        detalles: `Producto ${pk_id_producto} no encontrado`,
        resultado: 'Error',
      }, { transaction: t });
      throw new Error('El producto especificado no existe.');
    }
  
    // 3. Buscar si el producto ya está en DetalleCarrito
    const detalleExistente = await DetalleCarrito.findOne({
      where: {
        fk_id_carrito: carritoPendiente.pk_id_carrito,
        fk_id_producto: pk_id_producto,
      },
      transaction: t,
    });
    if (detalleExistente) {
      // Actualizar cantidad + subtotal
      const nuevaCantidad = detalleExistente.cantidad + cantidad;
      const nuevoSubtotal = nuevaCantidad * producto.precio;
      await detalleExistente.update({
        cantidad: nuevaCantidad,
        subtotal: nuevoSubtotal,
      }, { transaction: t });

      // Registrar en Log
      await Log.create({
        fk_id_usuario,
        entidadAfectada: 'Detalle_Carrito',
        operacion: 'UPDATE',
        detalles: `Producto ${pk_id_producto} ya existente en carrito. Se suma cantidad. Nueva cantidad: ${nuevaCantidad}`,
        resultado: 'Éxito',
      }, { transaction: t });
    } else {
      // Insertar nuevo detalle
      const precio_unitario = producto.precio;
      const subtotal = precio_unitario * cantidad;
      await DetalleCarrito.create({
        fk_id_carrito: carritoPendiente.pk_id_carrito,
        fk_id_producto: pk_id_producto,
        precio_unitario,
        cantidad,
        subtotal,
      }, { transaction: t });

      // Registrar en Log
      await Log.create({
        fk_id_usuario,
        entidadAfectada: 'Detalle_Carrito',
        operacion: 'INSERT',
        detalles: `Nuevo producto agregado al carrito. Producto: ${pk_id_producto}, Cantidad: ${cantidad}, Subtotal: ${subtotal}`,
        resultado: 'Éxito',
      }, { transaction: t });
    }

    // 4. Actualizar total del carrito
    const nuevaSuma = await DetalleCarrito.sum('subtotal', {
      where: { fk_id_carrito: carritoPendiente.pk_id_carrito },
      transaction: t,
    });
    await carritoPendiente.update({ total: nuevaSuma || 0 }, { transaction: t });

    // Registrar en Log
    await Log.create({
      fk_id_usuario,
      entidadAfectada: 'Carrito',
      operacion: 'UPDATE',
      detalles: `Total del carrito actualizado a ${nuevaSuma}`,
      resultado: 'Éxito',
    }, { transaction: t });

    await t.commit();
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

/**
 * @description Eliminar un producto específico del carrito
 * @param {Object} data - { fk_id_producto, fk_id_usuario }
 */
export const eliminarDetalleCarritoSequelize = async (data) => {
  const { fk_id_producto, fk_id_usuario } = data;

  const t = await sequelize.transaction();
  try {
    // 1. Buscar el carrito pendiente
    const carritoPendiente = await Carrito.findOne({
      where: { fk_id_usuario, fk_estado: Estados.PENDIENTE },
      transaction: t,
    });
    if (!carritoPendiente) {
      throw new Error('No existe un carrito pendiente para este usuario.');
    }

    // 2. Verificar que el producto existe en el detalle
    const detalle = await DetalleCarrito.findOne({
      where: {
        fk_id_carrito: carritoPendiente.pk_id_carrito,
        fk_id_producto,
      },
      transaction: t,
    });
    if (!detalle) {
      throw new Error('El producto no existe en el detalle del carrito.');
    }

    // 3. Eliminar el detalle
    await detalle.destroy({ transaction: t });

    // 4. Actualizar el total del carrito
    const nuevaSuma = await DetalleCarrito.sum('subtotal', {
      where: { fk_id_carrito: carritoPendiente.pk_id_carrito },
      transaction: t,
    });
    await carritoPendiente.update({ total: nuevaSuma || 0 }, { transaction: t });

    // Registrar en Log
    await Log.create({
      fk_id_usuario,
      entidadAfectada: 'Detalle_Carrito',
      operacion: 'DELETE',
      detalles: `Eliminado producto ${fk_id_producto} del carrito ${carritoPendiente.pk_id_carrito}`,
      resultado: 'Éxito',
    }, { transaction: t });

    await t.commit();
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

/**
 * @description Eliminar todos los detalles del carrito
 * @param {number} fk_id_usuario - ID del usuario
 */
export const eliminarDetallesCarritoSequelize = async (fk_id_usuario) => {
  const t = await sequelize.transaction();
  try {
    // 1. Buscar carrito pendiente
    const carritoPendiente = await Carrito.findOne({
      where: { fk_id_usuario, fk_estado: Estados.PENDIENTE },
      transaction: t,
    });
    if (!carritoPendiente) {
      throw new Error('No existe un carrito pendiente para el usuario.');
    }

    // 2. Verificar si tiene detalles
    const countDetalles = await DetalleCarrito.count({
      where: { fk_id_carrito: carritoPendiente.pk_id_carrito },
      transaction: t,
    });
    if (countDetalles === 0) {
      throw new Error('El carrito no tiene detalles para eliminar.');
    }

    // 3. Eliminar todos los detalles
    await DetalleCarrito.destroy({
      where: { fk_id_carrito: carritoPendiente.pk_id_carrito },
      transaction: t,
    });

    // 4. Actualizar total = 0
    await carritoPendiente.update({ total: 0 }, { transaction: t });

    // 5. Registrar en Log
    await Log.create({
      fk_id_usuario,
      entidadAfectada: 'Detalle_Carrito',
      operacion: 'DELETE_ALL',
      detalles: `Detalles eliminados del carrito ${carritoPendiente.pk_id_carrito}`,
      resultado: 'Éxito'
    }, { transaction: t });

    await t.commit();
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

/**
 * @description Actualizar la cantidad de un producto del carrito. Si la nueva cantidad = 0, elimina el detalle.
 * @param {Object} data - { fk_id_usuario, fk_id_producto, nueva_cantidad }
 */
export const actualizarDetalleCarritoSequelize = async (data) => {
  const { fk_id_usuario, fk_id_producto, nueva_cantidad } = data;

  const t = await sequelize.transaction();
  try {
    // 1. Buscar carrito pendiente
    const carritoPendiente = await Carrito.findOne({
      where: { fk_id_usuario, fk_estado: Estados.PENDIENTE },
      transaction: t,
    });
    if (!carritoPendiente) {
      throw new Error('No existe un carrito pendiente para este usuario.');
    }

    // 2. Buscar el detalle
    const detalle = await DetalleCarrito.findOne({
      where: {
        fk_id_carrito: carritoPendiente.pk_id_carrito,
        fk_id_producto,
      },
      transaction: t,
    });
    if (!detalle) {
      throw new Error('El producto no existe en el detalle del carrito.');
    }

    // 3. Validar nueva_cantidad
    if (nueva_cantidad < 0) {
      throw new Error('La cantidad no puede ser negativa.');
    }
   
    if (nueva_cantidad == 0) {
      // Eliminar el detalle
      await detalle.destroy({ transaction: t });
      // Registrar en Log
      await Log.create({
        fk_id_usuario,
        entidadAfectada: 'Detalle_Carrito',
        operacion: 'DELETE',
        detalles: `Detalle eliminado. Carrito ID: ${carritoPendiente.pk_id_carrito}, Producto ID: ${fk_id_producto}`,
        resultado: 'Éxito'
      }, { transaction: t });
    } else {
      // Actualizar la cantidad y el subtotal
      const precio_unitario = detalle.precio_unitario;
      const nuevoSubtotal = precio_unitario * nueva_cantidad;
      await detalle.update({
        cantidad: nueva_cantidad,
        subtotal: nuevoSubtotal,
      }, { transaction: t });

      // Registrar en Log
      await Log.create({
        fk_id_usuario,
        entidadAfectada: 'Detalle_Carrito',
        operacion: 'UPDATE',
        detalles: `Detalle actualizado. Nueva cantidad: ${nueva_cantidad}, Nuevo subtotal: ${nuevoSubtotal}`,
        resultado: 'Éxito'
      }, { transaction: t });
    }

    // 4. Actualizar total del carrito
    const nuevaSuma = await DetalleCarrito.sum('subtotal', {
      where: { fk_id_carrito: carritoPendiente.pk_id_carrito },
      transaction: t,
    });
    await carritoPendiente.update({ total: nuevaSuma || 0 }, { transaction: t });

    await t.commit();
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

/**
 * @description Confirmar el carrito => Verificar stock, restar stock, crear Pedido (fk_estado=4), 
 * mover DetalleCarrito a DetallePedido, inactivar Carrito (fk_estado=2).
 * @param {number} fk_id_usuario - ID del usuario
 */
export const confirmarCarritoSequelize = async (fk_id_usuario) => {
    const t = await sequelize.transaction();
    try {
      // 1. Buscar Carrito pendiente
      const carritoPendiente = await Carrito.findOne({
        where: { fk_id_usuario, fk_estado: Estados.PENDIENTE }, // 3
        transaction: t,
      });
      if (!carritoPendiente) {
        throw new Error('No existe un carrito pendiente para este usuario.');
      }
  
      // 2. Obtener todos los DetalleCarrito con su Producto (para verificar stock)
      const detalles = await DetalleCarrito.findAll({
        where: { fk_id_carrito: carritoPendiente.pk_id_carrito },
        include: [{ model: Producto }],
        transaction: t,
      });
      if (!detalles.length) {
        throw new Error('El carrito no tiene productos para confirmar.');
      }
  
      // 3. Verificar stock de cada producto
      for (const det of detalles) {
        const prod = det.Producto;
        if (det.cantidad > prod.stock) {
          // Registrar error en Log
          await Log.create({
            fk_id_usuario,
            entidadAfectada: 'Carrito',
            operacion: 'UPDATE',
            detalles: `Stock insuficiente para producto ${prod.pk_id_producto} (Solicitado: ${det.cantidad}, Stock: ${prod.stock})`,
            resultado: 'Error',
          }, { transaction: t });
  
          throw new Error('No hay suficiente stock para uno o más productos en el carrito.');
        }
      }
  
      // 4. Descontar stock de cada producto
      for (const det of detalles) {
        const prod = det.Producto;
        const nuevoStock = prod.stock - det.cantidad;
        await prod.update({ stock: nuevoStock }, { transaction: t });
      }
  
      // 5. Crear el Pedido en estado "En proceso" (4)
      //    Suponiendo que fk_cliente = fk_id_usuario.
      //    También podrías tener "fecha_pedido" con new Date() o dejar que la BD lo maneje.
      const nuevoPedido = await Pedido.create({
        fk_cliente: fk_id_usuario,
        fk_estado: Estados.EN_PROCESO, // 4
        total: carritoPendiente.total,  
        //fecha se crea automáticamente
      }, { transaction: t });
  
      // 6. Copiar cada DetalleCarrito --> Detalle_Pedido
      //    precio_unitario, cantidad, subtotal
      for (const det of detalles) {
        await DetallePedido.create({
          fk_id_pedido: nuevoPedido.pk_id_pedido,
          fk_id_producto: det.fk_id_producto,
          precio_unitario: det.precio_unitario,
          cantidad: det.cantidad,
          subtotal: det.subtotal,
        }, { transaction: t });
      }
  
      // 7. Cambiar estado del Carrito a INACTIVO (2)
      await carritoPendiente.update({
        fk_estado: Estados.INACTIVO, // 2
      }, { transaction: t });
  
      // 8. Registrar la confirmación en Log
      await Log.create({
        fk_id_usuario,
        entidadAfectada: 'Carrito',
        operacion: 'UPDATE',
        detalles: `Carrito (ID=${carritoPendiente.pk_id_carrito}) confirmado. Pedido (ID=${nuevoPedido.pk_id_pedido}) creado. Stock descontado.`,
        resultado: 'Éxito',
      }, { transaction: t });
  
      // 9.Registrar la creación del Pedido en Log
      await Log.create({
        fk_id_usuario,
        entidadAfectada: 'Pedidos',
        operacion: 'INSERT',
        detalles: `Pedido creado (ID=${nuevoPedido.pk_id_pedido}), Cliente ID=${fk_id_usuario}, Total=${carritoPendiente.total}`,
        resultado: 'Éxito',
      }, { transaction: t });
  
      // Confirmar la transacción
      await t.commit();
    } catch (error) {
      // Revertir la transacción y relanzar
      await t.rollback();
  
      throw error;
    }
  };
  

export default {
  obtenerDetallesCarritoPorUsuarioSequelize,
  agregarProductoAlCarritoSequelize,
  eliminarDetalleCarritoSequelize,
  eliminarDetallesCarritoSequelize,
  actualizarDetalleCarritoSequelize,
  confirmarCarritoSequelize,
};
