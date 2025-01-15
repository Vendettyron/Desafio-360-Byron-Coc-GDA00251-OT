import Categoria from '../models/Categoria.js';
import Log from '../models/Log.js';
import sequelize from '../config/dbSequelize.js';
import Estados from '../config/estados.js'
import Producto from '../models/Producto.js';

 
/**
 * @description Obtener todas las categorías de la base de datos.
 * @returns  {Promise<Object>} - Lista de categorías
 * */

export const obtenerCategoriasSequelize = async () => {
    try {
      const categorias = await Categoria.findAll();
      return categorias;
    } catch (error) {
      throw error;
    }
  };

/**
 * @description Obtener una categoría por su ID de la base de datos.
 * @param {Number} id - ID de la categoría
 * @returns  {Promise<Object>} - Categoría encontrada
 * */

export const obtenerCategoriaPorIdSequelize = async (id) => {
    try {
      const categoria = await Categoria.findByPk(id);
      return categoria;
    } catch (error) {
      throw error;
    }
  };


/**
 * @description Crear una nueva categoría en la base de datos.
 * @param {Object} data - Datos de la categoría { nombre, descripcion, fk_estado, fk_id_usuario }
 * @returns  {Promise<Object>} - Categoría creada
 * */

export const crearCategoriaSequelize = async (data) => {
    const { nombre, descripcion, fk_estado, fk_id_usuario } = data;
    
    const t = await sequelize.transaction();
    console.log('Creando categoría (Sequelize)...');
    try {
      // 1. Crear la Categoría
      const nuevaCategoria = await Categoria.create({
        nombre,
        descripcion,
        fk_estado,
      }, { transaction: t });

      console.log('Categoría creada:', nuevaCategoria);
      console.log('Creando log... con el id del usuario:', fk_id_usuario);

        // Insertar en Log 
        try {
        await Log.create({
            fk_id_usuario,
            entidadAfectada: 'Categorias',
            operacion: 'INSERT',
            detalles: `Categoría creada: ID=${nuevaCategoria.pk_id_categoria} nombre=${nuevaCategoria.nombre}`,
            resultado: 'Éxito',
        }, { transaction: t });
        } catch (logError) {
        console.error('Error al insertar en Log:', logError.parent?.message);
        throw logError; 
        }
        // 3. Confirmar transacción
        await t.commit();

      console.log('Log creado');
  
      return nuevaCategoria;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  };

/**
 * @description Actualizar una categoría existente en la base de datos.
 * @param {Object} data - Datos de la categoría { id_categoria, nombre, descripcion, fk_estado, fk_id_usuario }
 * @returns {Promise<Object>} - Categoría actualizada
 * */

  export const actualizarCategoriaSequelize = async (data) => {
    const { id_categoria, nombre, descripcion, fk_estado, fk_id_usuario } = data;
  
    const t = await sequelize.transaction();
    try {
      // 1. Buscar la Categoría
      const categoria = await Categoria.findByPk(id_categoria, { transaction: t });
      if (!categoria) {
        throw new Error(`No se encontró la categoría con ID ${id_categoria}`);
      }
  
      // 2. Actualizar campos
      await categoria.update({
        nombre,
        descripcion,
        fk_estado,
      }, { transaction: t });

      // 3. Inactivar Productos asociados
      const [numProductosAfectados] = await Producto.update({
        fk_estado: Estados.INACTIVO,
      }, {
        where: { fk_categoria: id_categoria },
        transaction: t,
      });

  
      // 4. Registrar en Log
      await Log.create({
        fk_id_usuario,
        entidadAfectada: 'Categorias',
        operacion: 'UPDATE',
        detalles: `Categoría actualizada: ID=${id_categoria} nombre=${nombre} productosInactivados=${numProductosAfectados}`,
        resultado: 'Éxito',
      }, { transaction: t });
  
      await t.commit();
      return categoria;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  };

/**
 * @description Inactivar una categoría existente en la base de datos.
 * @param {Object} data - Datos de la categoría { id_categoria, fk_id_usuario }
 * @returns {Promise<Object>} - Categoría inactivada
 * */

  export const activarCategoriaSequelize = async (data) => {
    const { pk_id_categoria, id_usuario_accion } = data;
  
    const t = await sequelize.transaction();
    try {
      // 1. Buscar la Categoría
      const categoria = await Categoria.findByPk(pk_id_categoria, { transaction: t });
      if (!categoria) {
        throw new Error(`No se encontró la categoría con ID ${pk_id_categoria}`);
      }
  
      // 2. Actualizar su fk_estado a Activo (1)
      await categoria.update({ fk_estado: Estados.ACTIVO }, { transaction: t });
  
      // 3. Registrar en Log
      await Log.create({
        fk_id_usuario: id_usuario_accion,
        entidadAfectada: 'Categorias',
        operacion: 'ACTIVACIÓN',
        detalles: `La categoría con ID ${pk_id_categoria} fue activada.`,
        resultado: 'Éxito',
      }, { transaction: t });
  
      await t.commit();
      return categoria;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  };

/**
 * @description Inactivar una categoría existente en la base de datos. También inactiva los productos asociados.
 * @param {Object} data - Datos de la categoría { id_categoria, fk_id_usuario }
 * @returns {Promise<Object>} - Categoría inactivada
 * 
*/

export const inactivarCategoriaSequelize = async (data) => {
  const { id_categoria, fk_id_usuario } = data;

  const t = await sequelize.transaction();
  try {
    // 1. Inactivar la Categoría (fk_estado = 2)
    const categoria = await Categoria.findByPk(id_categoria, { transaction: t });
    if (!categoria) {
      throw new Error(`No se encontró la categoría con ID ${id_categoria}`);
    }

    await categoria.update({ fk_estado: Estados.INACTIVO }, { transaction: t });

    // 2. Inactivar Productos asociados
    const [numProductosAfectados] = await Producto.update({
      fk_estado: Estados.INACTIVO,
    }, {
      where: { fk_categoria: id_categoria },
      transaction: t,
    });

    // 3. Registrar en Log la actualización de la categoría
    await Log.create({
      fk_id_usuario,
      entidadAfectada: 'Categorias',
      operacion: 'UPDATE',
      detalles: `Categoría inactivada: ID=${id_categoria}`,
      resultado: 'Éxito',
    }, { transaction: t });

    // 4. Registrar en Log la actualización de los productos
    await Log.create({
      fk_id_usuario,
      entidadAfectada: 'Productos',
      operacion: 'UPDATE',
      detalles: `Productos inactivados: Categoría ID=${id_categoria}, Total Productos Inactivados=${numProductosAfectados}`,
      resultado: 'Éxito',
    }, { transaction: t });

    await t.commit();
    return { categoria, numProductosAfectados };
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

  
  


export default {
    obtenerCategoriasSequelize,
    obtenerCategoriaPorIdSequelize,
    crearCategoriaSequelize,
    actualizarCategoriaSequelize,
    activarCategoriaSequelize,
    inactivarCategoriaSequelize,
};