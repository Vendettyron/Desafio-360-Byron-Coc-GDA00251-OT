import Producto from '../models/Producto.js';
import Log from '../models/Log.js';
import sequelize from '../config/dbSequelize.js';
import Estados from '../config/estados.js';

/**
 * @description Obtener la lista de productos activos
 * @returns {Promise<Array>} - Lista de productos activos
 * @access Accesible para Admin 
 */

export const crearProductoSequelize = async (data) => {
  const {
    fk_categoria,
    fk_estado,
    fk_proveedor,
    nombre,
    descripcion,
    precio,
    stock,
    fk_id_usuario
  } = data;

  // Manejo con transacción 
  const t = await sequelize.transaction();
  try {
    // 1. Insertar producto
    const nuevoProducto = await Producto.create({
      fk_categoria,
      fk_estado,
      fk_proveedor,
      nombre,
      descripcion,
      precio,
      stock,
    }, { transaction: t });

    // 2. Insertar en Log
    await Log.create({
      fk_id_usuario,  
      entidadAfectada: 'Productos',
      operacion: 'INSERT',
      detalles: `Producto insertado: ${nombre}, precio: ${precio}, stock: ${stock}`,
      resultado: 'Éxito'
    }, { transaction: t });

    // 3. Hacer commit
    await t.commit();

    // Devolvemos el ID del producto
    return nuevoProducto.pk_id_producto;
  } catch (error) {
    // rollback si algo falla
    await t.rollback();
    throw error;
  }
};

/**
 * @description Obtener producto por ID especifico
 * @param {Number} pk_id_producto - ID del producto
 * @returns {Promise<Object>} - Producto encontrado
 * @access Accesible para Admin y clientes
 */

export const obtenerProductoPorIdSequelize = async (pk_id_producto) => {
    try {
      const producto = await Producto.findByPk(pk_id_producto);
      return producto; // Devuelve null si no existe
    } catch (error) {
      throw error;
    }
  };

/** 
 * @description Actualizar un producto existente
 * @param {Object} data - Datos del producto a actualizar
 * @returns {Promise<Object>} - Producto actualizado
 * */

  export const actualizarProductoSequelize = async (data) => {
    const {
      id_producto,
      fk_categoria,
      fk_estado,
      fk_proveedor,
      nombre,
      descripcion,
      precio,
      stock,
      fk_id_usuario,
    } = data;
  
    const t = await sequelize.transaction();
    try {
      // 1. Buscar el producto
      const producto = await Producto.findByPk(id_producto, { transaction: t });
      if (!producto) {
        throw new Error(`No se encontró el producto con ID ${id_producto}`);
      }
  
      // 2. Actualizar
      await producto.update({
        fk_categoria,
        fk_estado,
        fk_proveedor,
        nombre,
        descripcion,
        precio,
        stock,
      }, { transaction: t });
  
      // 3. Registrar en Log
      await Log.create({
        fk_id_usuario,
        entidadAfectada: 'Productos',
        operacion: 'UPDATE',
        detalles: `Producto actualizado: ID=${id_producto}`,
        resultado: 'Éxito',
      }, { transaction: t });
  
      await t.commit();
      return producto;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  };


/**
 * @description Inactivar un producto existente
 * @param {Object} data - Datos del producto a inactivar
 * @returns {Promise<Object>} - Producto inactivado
 * @access Accesible para Admin
 * */

  export const inactivarProductoSequelize = async (data) => {
    const { id_producto, fk_id_usuario } = data;
  
    const t = await sequelize.transaction();
    try {
      // 1. Buscar el producto
      const producto = await Producto.findByPk(id_producto, { transaction: t });
      if (!producto) {
        throw new Error(`No se encontró el producto con ID ${id_producto}`);
      }
  
      // 2. Inactivar (estado = 2)
      await producto.update({ fk_estado: Estados.INACTIVO }, { transaction: t });
  
      // 3. Registrar en Log
      await Log.create({
        fk_id_usuario,
        entidadAfectada: 'Productos',
        operacion: 'UPDATE',
        detalles: `Producto inactivado: ID=${id_producto} nomre=${producto.nombre}`,
        resultado: 'Éxito',
      }, { transaction: t });
  
      await t.commit();
      return producto;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  };

/**
 * @description Activar un producto existente
 * @param {Object} data - Datos del producto a activar
 * @returns {Promise<Object>} - Producto activado
 * @access Accesible para Admin
 * */

  export const activarProductoSequelize = async (data) => {
    const { pk_id_producto, id_usuario_accion } = data;
  
    const t = await sequelize.transaction();
    try {
      const producto = await Producto.findByPk(pk_id_producto, { transaction: t });
      if (!producto) {
        throw new Error(`No se encontró el producto con ID ${pk_id_producto}`);
      }
  
      await producto.update({ fk_estado: Estados.ACTIVO }, { transaction: t });
  
      await Log.create({
        fk_id_usuario: id_usuario_accion,
        entidadAfectada: 'Productos',
        operacion: 'ACTIVACIÓN',
        detalles: `El producto con ID ${pk_id_producto} y nombre=${producto.nombre} fue activado.`,
        resultado: 'Éxito'
      }, { transaction: t });
  
      await t.commit();
      return producto;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  };

/**
 * @description Obtener la lista de todos los productos
 * @returns {Promise<Array>} - Lista de todos los productos
 * @access Accesible para Admin
 * */

  export const obtenerProductosSequelize = async () => {
    try {
      const productos = await Producto.findAll();
      return productos; // Un array con todos
    } catch (error) {
      throw error;
    }
  };

/**
 * @description Obtener la lista de productos activos
 * @returns {Promise<Array>} - Lista de productos activos
 * @access Accesible para Admin y clientes
 * */

  export const obtenerProductosActivosSequelize = async () => {
    try {
      const productosActivos = await Producto.findAll({
        where: { fk_estado: Estados.ACTIVO }, // 1 = Activo
      });
      return productosActivos;
    } catch (error) {
      throw error;
    }
  };

  export default
    {
        crearProductoSequelize,
        obtenerProductoPorIdSequelize,
        actualizarProductoSequelize,
        inactivarProductoSequelize,
        activarProductoSequelize,
        obtenerProductosSequelize,
        obtenerProductosActivosSequelize
    };
    
  
  
  
  
  
  
