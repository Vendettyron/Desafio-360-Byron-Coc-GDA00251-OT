import { poolPromise} from '../database/DbConection.js';
import productosService from '../services/productosService.js'

/**
 * Obtener la lista de productos
 * Accesible para Admin
 */
export const obtenerProductos = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
        .query('SELECT * FROM Productos'); //  consulta

        res.json(result.recordset);
    } catch (error) {
        console.error('Error obteniendo productos:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};


/**
 * Obtener un producto por su IDe
 */
export const obtenerProductoPorId = async (req, res) => {
    const { id } = req.params; // Obtener el ID del producto desde req.params
    const pk_id_producto = Number(id); // Convertir a número

    // Validar que el ID sea válido
    if (!pk_id_producto || isNaN(pk_id_producto)) {
        return res.status(400).json({ message: 'ID del producto inválido.' });
    }

    try {
        const producto = await productosService.obtenerProductoPorId(pk_id_producto);
        
        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado.' });
        }

        res.json(producto);
    } catch (error) {
        console.error('Error obteniendo producto por ID:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

/**
 * Crear un nuevo producto
 *  * Accesible solo para Admin
 */
export const crearProducto = async (req, res) => {
    const { fk_categoria, fk_estado, fk_proveedor, nombre, descripcion, precio, stock } = req.body;
    const fk_id_usuario = req.user.id; // Obtener el ID del usuario desde req.user
    
    // Validar que se proporcionaron todos los campos necesarios
    if (!fk_categoria || !fk_estado || !fk_proveedor || !nombre || !descripcion || !stock || !fk_id_usuario) {
        return res.status(400).json({ message: 'Faltan campos obligatorios.' });
    }

    try {
        const idProducto = await productosService.crearProducto({
            fk_categoria,
            fk_estado,
            fk_proveedor,
            nombre,
            descripcion,
            precio,
            stock,
            fk_id_usuario
        });

        res.status(201).json({ 
            message: 'Producto creado exitosamente.',
            id_producto: idProducto // Incluir el ID en la respuesta
        });
    } catch (error) {
        console.error('Error creando producto:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

/**
 * Actualizar un producto existente
 *   Accesible solo para Admin
 */

export const actualizarProducto = async (req, res) => {
    const { fk_categoria, fk_estado, fk_proveedor, nombre, descripcion, precio, stock } = req.body;
    const { id } = req.params; // Obtener el ID del producto desde req.params
    const id_producto = Number(id); // Convertir a número
    const fk_id_usuario = req.user.id; // Obtener el ID del usuario desde req.user

    // Validar que se proporcionaron todos los campos necesarios y que id_producto es válido
    if (
        !id_producto ||
        isNaN(id_producto) ||
        !fk_categoria ||
        !fk_estado ||
        !fk_proveedor ||
        !nombre ||
        !descripcion ||
        isNaN(precio) ||
        isNaN(stock) ||
        !fk_id_usuario
    ) {
        return res.status(400).json({ message: 'Faltan campos obligatorios o los datos son inválidos.' });
    }

    try {
        await productosService.actualizarProducto({
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

        res.json({ message: 'Producto actualizado exitosamente.' });
    } catch (error) {
        console.error('Error actualizando producto:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};


/**
 * Inactivar un producto
 * Accesible solo para Admin
 */
export const inactivarProducto = async (req, res) => {
    const { id } = req.params;
    const id_producto = Number(id); // Convertir a número
    const fk_id_usuario = req.user.id; // Obtener el ID del usuario desde req.user

    try {
        await productosService.inactivarProducto({
            id_producto,
            fk_id_usuario
        });

        res.json({ message: 'Producto inactivado exitosamente.' });
    } catch (error) {
        console.error('Error inactivando producto:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

/**
 * Activar un producto
 * Accesible solo para Admin
 */
export const activarProducto = async (req, res) => {
    const { id } = req.params;
    const pk_id_producto = Number(id); // Convertir a número
    const id_usuario_accion = req.user.id; // Obtener el ID del usuario desde req.user

    try {
        await productosService.activarProducto({
            pk_id_producto,
            id_usuario_accion
        });
        res.json({ message: 'Producto activado exitosamente.' });
    } catch (error) {
        console.error('Error activando producto:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

/**
 * Subir una imagen de un producto
 * accedido solo por Admin
 * 
 */

export const subirImagenProducto = (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No se subió ninguna imagen.' });
    }
    res.status(200).json({ mensaje: 'Imagen subida exitosamente.' });
  };