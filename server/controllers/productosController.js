import {
    crearProductoSequelize,
    obtenerProductosSequelize,
    obtenerProductoPorIdSequelize,
    actualizarProductoSequelize,
    inactivarProductoSequelize,
    activarProductoSequelize,
    obtenerProductosActivosSequelize,
    obtenerProductosPorCategoriaSequelize
  } from '../services/productosService.js';
  
  /**
   * @description Crear un producto
   * @route POST /api/productos/CrearProducto
   * @access Privado (Admin)
   */
  export const crearProducto = async (req, res) => {
    const {
      fk_categoria,
      fk_estado,
      fk_proveedor,
      nombre,
      descripcion,
      precio,
      stock,
    } = req.body;
    const fk_id_usuario = req.user.id; // Admin que crea
  
    // Validar
    if (!fk_categoria || !fk_estado || !fk_proveedor || !nombre || !descripcion || isNaN(precio) || !stock || !fk_id_usuario) {
      return res.status(400).json({ message: 'Faltan campos obligatorios.' });
    }
  
    try {
      const idProducto = await crearProductoSequelize({
        fk_categoria,
        fk_estado,
        fk_proveedor,
        nombre,
        descripcion,
        precio,
        stock,
        fk_id_usuario,
      });
      res.json({ message: 'Producto creado con éxito', idProducto });
    } catch (error) {
      console.error('Error al crear producto (Sequelize):', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  };
  
  /**
   * @description Obtener todos los productos
   * @route GET /api/productos/ObtenerProductos
   * @access Admin y Cliente
   */
  export const obtenerProductos = async (req, res) => {
    try {
      const productos = await obtenerProductosSequelize();
      res.json(productos);
    } catch (error) {
      console.error('Error obteniendo productos (Sequelize):', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  };

  /**
   * @route GET /api/productos/ObtenerProductosActivos  
   * @description Obtener productos activos
   * @access Admin y Cliente
   */
  export const obtenerProductosActivos = async (req, res) => {
    try {
      const productosActivos = await obtenerProductosActivosSequelize();
      res.json(productosActivos);
    } catch (error) {
      console.error('Error al obtener productos activos (Sequelize):', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  };

  /**
 * @description Obtener los productos de una categoría específica (solo activos).
 * @route GET /api/productos/ObtenerProductosPorCategoria/:idCategoria
 * @access Privado (Admin, Cliente)
 */
export const obtenerProductosPorCategoria = async (req, res) => {
  const { idCategoria } = req.params;

  if (!idCategoria) {
    return res.status(400).json({ message: 'Faltan campos obligatorios.' });
  }

  try {
    const productos = await obtenerProductosPorCategoriaSequelize(idCategoria);
    res.json(productos);
  } catch (error) {
    console.error('Error obteniendo productos por categoría (Sequelize):', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};
  
  /**
   * @description Obtener un producto por su ID
   * @route GET /api/productos/ObtenerProductosPorId/:id
   * @access Admin y Cliente
   */
  export const obtenerProductoPorId = async (req, res) => {
    const { id } = req.params;
    const pk_id_producto = Number(id);
  
    if (!pk_id_producto) {
      return res.status(400).json({ message: 'ID inválido.' });
    }
    try {
      const producto = await obtenerProductoPorIdSequelize(pk_id_producto);
      if (!producto) {
        return res.status(404).json({ message: 'Producto no encontrado.' });
      }
      res.json(producto);
    } catch (error) {
      console.error('Error al obtener producto por ID (Sequelize):', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  };
  
  /**
   * @description Actualizar un producto existente por su ID
   * @route PUT /api/productos/ActualizarProducto/:id
   * @access Privado (Admin)
   */
  export const actualizarProducto = async (req, res) => {
    const { id } = req.params; // ID del producto
    const id_producto = Number(id);
    const {
      fk_categoria,
      fk_estado,
      fk_proveedor,
      nombre,
      descripcion,
      precio,
      stock,
    } = req.body;
    const fk_id_usuario = req.user.id; // obtener el ID del usuario desde req.user 
  
    if (!id_producto || !fk_categoria || !fk_estado || !fk_proveedor || !nombre || !descripcion || isNaN(precio) || !stock) {
      return res.status(400).json({ message: 'Faltan campos obligatorios.' });
    }
  
    try {
      const productoActualizado = await actualizarProductoSequelize({
        id_producto,
        fk_categoria,
        fk_estado,
        fk_proveedor,
        nombre,
        descripcion,
        precio,
        stock,
        fk_id_usuario
      });
      res.json({ message: 'Producto actualizado con éxito', producto: productoActualizado });
    } catch (error) {
      console.error('Error actualizando producto (Sequelize):', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  };
  
  /**
   * @description Inactivar un producto por su ID
   * @route PUT /api/productos/InactivarProducto/:id
   * @access Privado (Admin)
   */
  export const inactivarProducto = async (req, res) => {
    const { id } = req.params;
    const id_producto = Number(id);
    const fk_id_usuario = req.user.id;
  
    if (!id_producto || !fk_id_usuario) {
      return res.status(400).json({ message: 'Faltan campos obligatorios.' });
    }
  
    try {
      const productoInactivado = await inactivarProductoSequelize({
        id_producto,
        fk_id_usuario
      });
      res.json({
        message: 'Producto inactivado con éxito',
        producto: productoInactivado
      });
    } catch (error) {
      console.error('Error inactivando producto (Sequelize):', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  };
  
  /**
   * @route PUT /api/productos/ActivarProducto/:id
   * @description Activar un producto por su ID
   * @access Privado (Admin)
   */
  export const activarProducto = async (req, res) => {
    const { id } = req.params;
    const pk_id_producto = Number(id);
    const id_usuario_accion = req.user.id;
  
    if (!pk_id_producto || !id_usuario_accion) {
      return res.status(400).json({ message: 'Faltan campos obligatorios.' });
    }
  
    try {
      const productoActivado = await activarProductoSequelize({
        pk_id_producto,
        id_usuario_accion
      });
      res.json({
        message: 'Producto activado con éxito',
        producto: productoActivado
      });
    } catch (error) {
      console.error('Error activando producto (Sequelize):', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  };

/**
 * @description Subir una imagen de un producto
 * @route POST /api/productos/subirImagen/:id   
 * @access accedido solo por Admin
 * 
 */

export const subirImagenProducto = (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No se subió ninguna imagen.' });
    }
    res.status(200).json({ mensaje: 'Imagen subida exitosamente.' });
  };