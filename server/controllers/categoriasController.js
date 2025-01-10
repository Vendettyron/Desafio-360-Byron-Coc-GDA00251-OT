import { 
  obtenerCategoriasSequelize,
  crearCategoriaSequelize,
  actualizarCategoriaSequelize,
  activarCategoriaSequelize,
  inactivarCategoriaSequelize,
  obtenerCategoriaPorIdSequelize,
} from '../services/categoriasService.js';

/**
 * @description Obtener todas las categorias 
 * @returns {Array} - Lista de categorias
 * */
export const obtenerCategorias = async (req, res) => {
  try {
    const categorias = await obtenerCategoriasSequelize();
    res.json(categorias);
  } catch (error) {
    console.error('Error obteniendo categorias (Sequelize):', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

/**
 * @description Obtener una categoria por su ID
 * @returns {Object} - Categoria encontrada
 * */

export const obtenerCategoriaPorId = async (req, res) => {
    const { id } = req.params;
    const id_categoria = Number(id);
    
    if (!id_categoria) {
        return res.status(400).json({ message: 'Faltan campos obligatorios.' });
    }
    
    try {
        const categoria = await obtenerCategoriaPorIdSequelize(id_categoria);
        res.json(categoria);
    } catch (error) {
        console.error('Error obteniendo categoria por ID (Sequelize):', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};


/**
 * @description Crear una nueva categoria
 * @returns {Object} - Mensaje de éxito
 * */

export const crearCategoria = async (req, res) => {
  const { nombre, descripcion, fk_estado } = req.body;
  const fk_id_usuario = req.user.id; // ID del usuario autenticado en el token JWT

  if (!nombre || !descripcion || !fk_estado || !fk_id_usuario) {
    return res.status(400).json({ message: 'Faltan campos obligatorios.' });
  }

  try {
    console.log('Creando categoria (Sequelize)...');
    // Usar Sequelize
    const nuevaCategoria = await crearCategoriaSequelize({
      nombre,
      descripcion,
      fk_estado,
      fk_id_usuario,
    });
    res.json({
      message: 'Categoría creada con éxito',
      categoria: nuevaCategoria
    });
  } catch (error) {
    console.error('Error creando categoria (Sequelize):', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

/**
 * @description Actualizar una categoria existente
 * @returns {Object} - Mensaje de éxito
 * */
export const actualizarCategoria = async (req, res) => {
  const { nombre, descripcion, fk_estado } = req.body;
  const { id } = req.params;
  const id_categoria = Number(id);
  const fk_id_usuario = req.user.id;

  if (!id_categoria || !nombre || !descripcion || !fk_estado || !fk_id_usuario) {
    return res.status(400).json({ message: 'Faltan campos obligatorios.' });
  }

  try {
    const categoriaActualizada = await actualizarCategoriaSequelize({
      id_categoria,
      nombre,
      descripcion,
      fk_estado,
      fk_id_usuario,
    });
    res.json({
      message: 'Categoría actualizada con éxito',
      categoria: categoriaActualizada
    });
  } catch (error) {
    console.error('Error actualizando categoria (Sequelize):', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

/**
 * @description Activar una categoria Por ID
 * @returns {Object} - Mensaje de éxito
 * */
export const activarCategoria = async (req, res) => {
  const { id } = req.params;
  const pk_id_categoria = Number(id);
  const id_usuario_accion = req.user.id;

  if (!pk_id_categoria || !id_usuario_accion) {
    return res.status(400).json({ message: 'Faltan campos obligatorios.' });
  }

  try {
    const categoriaActivada = await activarCategoriaSequelize({
      pk_id_categoria,
      id_usuario_accion,
    });
    res.json({
      message: 'Categoría activada con éxito',
      categoria: categoriaActivada
    });
  } catch (error) {
    console.error('Error activando categoria (Sequelize):', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

/**
 * @description Inactivar una categoria Por ID, ademas inactiva los productos asociados
 * @returns {Object} - Mensaje de éxito
 * */
export const inactivarCategoria = async (req, res) => {
    const { id } = req.params;
    const id_categoria = Number(id);
    const fk_id_usuario = req.user.id;
  
    if (!id_categoria || !fk_id_usuario) {
      return res.status(400).json({ message: 'Faltan campos obligatorios.' });
    }
  
    try {
      const { categoria, numProductosAfectados } = await inactivarCategoriaSequelize({
        id_categoria,
        fk_id_usuario
      });
      res.json({
        message: `Categoría inactivada con éxito. Se inactivaron ${numProductosAfectados} producto(s).`,
        categoria,
      });
    } catch (error) {
      console.error('Error inactivando categoria (Sequelize):', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  };
