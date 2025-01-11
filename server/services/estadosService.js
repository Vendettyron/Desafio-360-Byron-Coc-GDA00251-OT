import Estado from '../models/Estado.js';
import Log from '../models/Log.js';
import sequelize from '../config/dbSequelize.js';

/**
 * @description Obtener todos los estados de la base de datos.
 * @returns {Promise<Array>} - Lista de estados
 * @access Accesible para Admin
 */
export const obtenerEstadosSequelize = async () => {
  try {
    const estados = await Estado.findAll();
    return estados;
  } catch (error) {
    throw error;
  }
};

/**
 * @description Obtener un estado por su ID.
 * @param {Number} pk_id_estado - ID del estado a consultar
 * @returns {Promise<Object|null>} - Estado encontrado o null si no existe
 * @access Accesible para Admin
 */
export const obtenerEstadoPorIdSequelize = async (pk_id_estado) => {
  try {
    const estado = await Estado.findByPk(pk_id_estado);
    return estado; 
  } catch (error) {
    throw error;
  }
};

/**
 * @description Crear un nuevo estado en la base de datos.
 * @param {Object} data - Datos del estado { nombre, fk_id_usuario_operacion }
 * @returns {Promise<Number>} - ID del estado recién creado
 * @access Accesible para Admin
 */
export const crearEstadoSequelize = async (data) => {
  const { nombre, fk_id_usuario_operacion } = data;

  const t = await sequelize.transaction();
  try {
    // 1. Crear el estado
    const nuevoEstado = await Estado.create({
      nombre,
    }, { transaction: t });

    // 2. Registrar en Log
    await Log.create({
      // fechaHora lo inserta la DB con GETDATE() por defecto
      fk_id_usuario: fk_id_usuario_operacion,
      entidadAfectada: 'Estados',
      operacion: 'INSERT',
      detalles: `Estado creado: ${nombre}`,
      resultado: 'Éxito',
    }, { transaction: t });

    await t.commit();
    return nuevoEstado.pk_id_estado;
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

/**
 * @description Actualizar un estado existente en la base de datos.
 * @param {Object} data - { pk_id_estado, nombre, fk_id_usuario_operacion }
 * @returns {Promise<Object>} - Estado actualizado
 * @access Accesible para Admin
 */
export const actualizarEstadoSequelize = async (data) => {
  const { pk_id_estado, nombre, fk_id_usuario_operacion } = data;

  const t = await sequelize.transaction();
  try {
    // 1. Buscar el estado
    const estado = await Estado.findByPk(pk_id_estado, { transaction: t });
    if (!estado) {
      throw new Error(`No se encontró el estado con ID ${pk_id_estado}`);
    }

    // 2. Actualizar nombre
    await estado.update({ nombre }, { transaction: t });

    // 3. Registrar en Log
    await Log.create({
      fk_id_usuario: fk_id_usuario_operacion,
      entidadAfectada: 'Estados',
      operacion: 'UPDATE',
      detalles: `Estado actualizado: ID=${pk_id_estado}, nombre=${nombre}`,
      resultado: 'Éxito',
    }, { transaction: t });

    await t.commit();
    return estado;
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

export default {
  obtenerEstadosSequelize,
  obtenerEstadoPorIdSequelize,
  crearEstadoSequelize,
  actualizarEstadoSequelize,
};
