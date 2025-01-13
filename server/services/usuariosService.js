import Usuario from '../models/Usuario.js';
import Log from '../models/Log.js';
import sequelize from '../config/dbSequelize.js';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';

/**
 * @description Obtener un usuario por su ID.
 * @param {Number} pk_id_usuario - ID del usuario
 * @returns {Promise<Object|null>} - Objeto usuario o null si no existe
 * @access Accesible para Admin
 */
export const obtenerUsuarioPorIdSequelize = async (pk_id_usuario) => {
  try {
    const usuario = await Usuario.findByPk(pk_id_usuario);
    return usuario;
  } catch (error) {
    throw error;
  }
};

/**
 * @description Obtener la lista de todos los usuarios.
 * @returns {Promise<Array>} - Lista de usuarios
 * @access Accesible para Admin
 */
export const obtenerUsuariosSequelize = async () => {
    try {
      const usuarios = await Usuario.findAll();
      return usuarios;
    } catch (error) {
      throw error;
    }
  };

  /**
 * @description Actualizar un usuario existente (ADMIN).
 * @param {Object} data - { id_usuario, nombre, apellido, direccion, correo, telefono, password, fk_rol, fk_estado, fk_id_usuario (admin) }
 * @returns {Promise<Object>} - Usuario actualizado
 * @access Accesible solo para Admin
 */
export const actualizarUsuarioSequelize = async (data) => {
    const {
      id_usuario,
      nombre,
      apellido,
      direccion,
      correo,
      telefono,
      password,
      fk_rol,
      fk_estado,
      fk_id_usuario, // admin que hace el cambio
    } = data;
  
    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
  
    const t = await sequelize.transaction();
    try {
      // 1. Buscar el usuario
      const usuario = await Usuario.findByPk(id_usuario, { transaction: t });
      if (!usuario) {
        throw new Error(`No se encontró el usuario con ID ${id_usuario}`);
      }
  
      // 2. Actualizar todos los campos
      await usuario.update({
        nombre,
        apellido,
        direccion,
        telefono,
        correo,
        password: hashedPassword,
        fk_rol,
        fk_estado,
      }, { transaction: t });
  
      // 3. Registrar en Log
      await Log.create({
        fk_id_usuario, // id del admin que hizo la operación
        entidadAfectada: 'Usuarios',
        operacion: 'UPDATE',
        detalles: `Usuario actualizado (ADMIN): ID=${id_usuario}, correo=${correo}`,
        resultado: 'Éxito',
      }, { transaction: t });
  
      await t.commit();
      return usuario;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  };

  /**
 * @description El usuario actualiza su propia información (sin cambiar password, rol y estado).
 * @param {Object} data - { pk_id_usuario, nombre, apellido, direccion, correo, telefono }
 * @returns {Promise<Object>} - Usuario actualizado
 * @access Accesible para Cliente
 */
export const actualizarUsuarioElMismoSequelize = async (data) => {
    const {
      pk_id_usuario,
      nombre,
      apellido,
      direccion,
      correo,
      telefono
    } = data;
  
    const t = await sequelize.transaction();
    try {
      // 1. Buscar el usuario actual
      const usuario = await Usuario.findByPk(pk_id_usuario, { transaction: t });
      if (!usuario) {
        throw new Error(`No se encontró el usuario con ID ${pk_id_usuario}`);
      }
  
      // 2. Si el correo es distinto al actual, verificar si no está en uso por otro usuario
      if (correo !== usuario.correo) {
        // Busca si el correoqa ya está en uso por otro usuario
        const existeCorreo = await Usuario.findOne({
          where: {
            correo,
            pk_id_usuario: { [Op.ne]: pk_id_usuario } // Excluir el usuario actual  de la búsqueda
          },
          transaction: t,
        });
        if (existeCorreo) {
          throw new Error('El correo proporcionado ya existe para otro usuario.');
        }
      }
  
      // 3. Actualizar la información
      await usuario.update({
        nombre,
        apellido,
        direccion,
        correo,
        telefono
      }, { transaction: t });
  
      // 4. Registrar en Log
      await Log.create({
        fk_id_usuario: pk_id_usuario, // El mismo usuario
        entidadAfectada: 'Usuarios',
        operacion: 'UPDATE',
        detalles: `Información actualizada para Usuario ID=${pk_id_usuario}. Nombre=${nombre}, Correo=${correo}`,
        resultado: 'Éxito'
      }, { transaction: t });
  
      await t.commit();
      return usuario;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  };

  /**
 * @description El usuario actualiza su contraseña.
 * @param {Object} data - { pk_id_usuario, newPassword }
 * @returns {Promise<Object>} - Usuario con contraseña actualizada
 * @access Accesible para el propio usuario
 */
export const actualizarPasswordUsuarioSequelize = async (data) => {
    const { pk_id_usuario, newPassword } = data;
  
    // 1. Hashear la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
  
    const t = await sequelize.transaction();
    try {
      // 2. Buscar el usuario
      const usuario = await Usuario.findByPk(pk_id_usuario, { transaction: t });
      if (!usuario) {
        throw new Error(`No se encontró el usuario con ID ${pk_id_usuario}`);
      }
  
      // 3. Actualizar password
      await usuario.update({
        password: hashedPassword
      }, { transaction: t });
  
      // 4. Registrar en Log
      await Log.create({
        fk_id_usuario: pk_id_usuario,
        entidadAfectada: 'Usuarios',
        operacion: 'UPDATE',
        detalles: `Usuario cambió su contraseña: ID=${pk_id_usuario}`,
        resultado: 'Éxito'
      }, { transaction: t });
  
      await t.commit();
      return usuario;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  };

  import Estados from '../config/estados.js';

/**
 * @description Inactivar un usuario existente (estado = 2).
 * @param {Object} data - { id_usuario, fk_id_usuario } (fk_id_usuario = admin que hace la op)
 * @returns {Promise<Object>} - Usuario inactivado
 * @access Accesible para Admin
 */
export const inactivarUsuarioSequelize = async (data) => {
  const { id_usuario, fk_id_usuario } = data;

  const t = await sequelize.transaction();
  try {
    const usuario = await Usuario.findByPk(id_usuario, { transaction: t });
    if (!usuario) {
      throw new Error(`No se encontró el usuario con ID ${id_usuario}`);
    }

    // Cambiar fk_estado = 2 (Inactivo)
    await usuario.update({ fk_estado: Estados.INACTIVO }, { transaction: t });

    // Registrar en log
    await Log.create({
      fk_id_usuario,
      entidadAfectada: 'Usuarios',
      operacion: 'UPDATE',
      detalles: `Usuario inactivado: ID=${id_usuario}`,
      resultado: 'Éxito'
    }, { transaction: t });

    await t.commit();
    return usuario;
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

/**
 * @description Activar un usuario existente (estado = 1).
 * @param {Object} data - { pk_id_usuario, id_usuario_accion }
 * @returns {Promise<Object>} - Usuario activado
 * @access Accesible para Admin
 */
export const activarUsuarioSequelize = async (data) => {
  const { pk_id_usuario, id_usuario_accion } = data;

  const t = await sequelize.transaction();
  try {
    const usuario = await Usuario.findByPk(pk_id_usuario, { transaction: t });
    if (!usuario) {
      throw new Error(`No se encontró el usuario con ID ${pk_id_usuario}`);
    }

    // Cambiar fk_estado = 1 (Activo)
    await usuario.update({ fk_estado: Estados.ACTIVO }, { transaction: t });

    await Log.create({
      fk_id_usuario: id_usuario_accion,
      entidadAfectada: 'Usuarios',
      operacion: 'UPDATE',
      detalles: `Usuario activado: ID=${pk_id_usuario}`,
      resultado: 'Éxito'
    }, { transaction: t });

    await t.commit();
    return usuario;
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

/**
 * @description El usuario se inactiva a sí mismo, verificando su correo y password.
 * @param {Object} data - { pk_id_usuario, correo, password }
 * @returns {Promise<Object>} - Usuario inactivado
 * @access Accesible para el propio usuario
 */
export const inactivarUsuarioElMismoSequelize = async (data) => {
    const { pk_id_usuario, correo, password } = data;
  
    const t = await sequelize.transaction();
    try {
      // 1. Buscar el usuario
      const usuario = await Usuario.findOne({
        where: { pk_id_usuario, correo }, // Mismo ID y correo
        transaction: t,
      });
      if (!usuario) {
        throw new Error('Usuario no encontrado o el correo no coincide.');
      }
  
      // 2. Validar la contraseña
      const passwordValida = await bcrypt.compare(password, usuario.password);
      if (!passwordValida) {
        throw new Error('Contraseña incorrecta.');
      }
  
      // 3. Verificar si ya está inactivo
      if (usuario.fk_estado === 2) {
        throw new Error('La cuenta ya está inactiva.');
      }
  
      // 4. Inactivar el usuario fk_estado(estado = 2)
      await usuario.update({ fk_estado: Estados.INACTIVO }, { transaction: t });
  
      // 5. Registrar en Log
      await Log.create({
        fk_id_usuario: pk_id_usuario,
        entidadAfectada: 'Usuarios',
        operacion: 'UPDATE',
        detalles: `Usuario se inactivó a sí mismo: ID=${pk_id_usuario}`,
        resultado: 'Éxito'
      }, { transaction: t });
  
      await t.commit();
      return usuario;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  };
  
  export default {
    obtenerUsuarioPorIdSequelize,
    obtenerUsuariosSequelize,
    actualizarUsuarioSequelize,
    actualizarUsuarioElMismoSequelize,
    actualizarPasswordUsuarioSequelize,
    inactivarUsuarioSequelize,
    activarUsuarioSequelize,
    inactivarUsuarioElMismoSequelize,
  };
  
  
  
  
  
