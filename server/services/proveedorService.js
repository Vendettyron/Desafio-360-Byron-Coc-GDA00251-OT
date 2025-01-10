import Proveedor from '../models/Proveedor.js';
import Log from '../models/Log.js';
import sequelize from '../config/dbSequelize.js';
import Estados from '../config/estados.js';

/**
 * @description Crear un nuevo proveedor en la base de datos.
 * @param {Object} data - Datos del proveedor { nombre, telefono, correo, fk_estado, fk_id_usuario }
 * @returns {Promise<Number>} - ID del proveedor recién creado
 * @access Accesible para Admin
 */
export const crearProveedorSequelize = async (data) => {
  const { nombre, telefono, correo, fk_estado, fk_id_usuario } = data;

  const t = await sequelize.transaction();
  try {
    // 1. Crear el proveedor
    const nuevoProveedor = await Proveedor.create({
      nombre,
      telefono,
      correo,
      fk_estado,
    }, { transaction: t });

    // 2. Registrar en Log
    await Log.create({
      // No pasamos fechaHora, la DB asigna GETDATE()
      fk_id_usuario,
      entidadAfectada: 'Proveedor',
      operacion: 'INSERT',
      detalles: `Proveedor creado: ${nombre}, teléfono: ${telefono}, correo: ${correo}`,
      resultado: 'Éxito',
    }, { transaction: t });

    await t.commit();
    return nuevoProveedor.pk_id_proveedor;
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

/**
 * @description Actualizar un proveedor existente en la base de datos.
 * @param {Object} data - { pk_id_proveedor, nombre, telefono, correo, fk_estado, fk_id_usuario }
 * @returns {Promise<Object>} - Proveedor actualizado
 * @access Accesible para Admin
 */
export const actualizarProveedorSequelize = async (data) => {
  const { pk_id_proveedor, nombre, telefono, correo, fk_estado, fk_id_usuario } = data;

  const t = await sequelize.transaction();
  try {
    // 1. Buscar el proveedor
    const proveedor = await Proveedor.findByPk(pk_id_proveedor, { transaction: t });
    if (!proveedor) {
      throw new Error(`No se encontró el proveedor con ID ${pk_id_proveedor}`);
    }

    // 2. Actualizar campos
    await proveedor.update({
      nombre,
      telefono,
      correo,
      fk_estado,
    }, { transaction: t });

    // 3. Registrar en Log
    await Log.create({
      fk_id_usuario,
      entidadAfectada: 'Proveedor',
      operacion: 'UPDATE',
      detalles: `Proveedor actualizado: ID=${pk_id_proveedor}`,
      resultado: 'Éxito',
    }, { transaction: t });

    await t.commit();
    return proveedor;
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

/**
 * @description Activar un proveedor (cambiar fk_estado a 1).
 * @param {Object} data - { pk_id_proveedor, id_usuario_accion }
 * @returns {Promise<Object>} - Proveedor activado
 * @access Accesible para Admin
 */
export const activarProveedorSequelize = async (data) => {
  const { pk_id_proveedor, id_usuario_accion } = data;

  const t = await sequelize.transaction();
  try {
    const proveedor = await Proveedor.findByPk(pk_id_proveedor, { transaction: t });
    if (!proveedor) {
      throw new Error(`No se encontró el proveedor con ID ${pk_id_proveedor}`);
    }

    // Activar el proveedor (fk_estado = 1)
    await proveedor.update({ fk_estado: Estados.ACTIVO }, { transaction: t });

    await Log.create({
      fk_id_usuario: id_usuario_accion,
      entidadAfectada: 'Proveedor',
      operacion: 'ACTIVACIÓN',
      detalles: `Proveedor activado: ID=${pk_id_proveedor}`,
      resultado: 'Éxito',
    }, { transaction: t });

    await t.commit();
    return proveedor;
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

/**
 * @description Inactivar un proveedor (cambiar fk_estado a 2).
 * @param {Object} data - { id_proveedor, fk_id_usuario }
 * @returns {Promise<Object>} - Proveedor inactivado
 * @access Accesible para Admin
 */
export const inactivarProveedorSequelize = async (data) => {
  const { id_proveedor, fk_id_usuario } = data;

  const t = await sequelize.transaction();
  try {
    const proveedor = await Proveedor.findByPk(id_proveedor, { transaction: t });
    if (!proveedor) {
      throw new Error(`No se encontró el proveedor con ID ${id_proveedor}`);
    }

    // Inactivar el proveedor (fk_estado = 2)
    await proveedor.update({ fk_estado: Estados.INACTIVO }, { transaction: t });

    await Log.create({
      fk_id_usuario,
      entidadAfectada: 'Proveedor',
      operacion: 'UPDATE',
      detalles: `Proveedor inactivado: ID=${id_proveedor}`,
      resultado: 'Éxito',
    }, { transaction: t });

    await t.commit();
    return proveedor;
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

/**
 * @description Obtener un proveedor por su ID
 * @param {Number} pk_id_proveedor - ID del proveedor
 * @returns {Promise<Object|null>} - Proveedor encontrado o null si no existe
 * @access Accesible para Admin y Cliente
 */
export const obtenerProveedorPorIdSequelize = async (pk_id_proveedor) => {
  try {
    const proveedor = await Proveedor.findByPk(pk_id_proveedor);
    return proveedor;
  } catch (error) {
    throw error;
  }
};

/**
 * @description Obtener todos los proveedores (ej. SELECT * FROM Proveedor)
 * @returns {Promise<Array>} - Lista de proveedores
 * @access Accesible para Admin y Cliente
 */
export const obtenerProveedoresSequelize = async () => {
  try {
    const proveedores = await Proveedor.findAll();
    return proveedores;
  } catch (error) {
    throw error;
  }
};

export default {
  crearProveedorSequelize,
  actualizarProveedorSequelize,
  activarProveedorSequelize,
  inactivarProveedorSequelize,
  obtenerProveedorPorIdSequelize,
  obtenerProveedoresSequelize,
};
