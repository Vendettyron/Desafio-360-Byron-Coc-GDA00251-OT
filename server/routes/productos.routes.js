import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import {
  crearProducto,
  obtenerProductos,
  actualizarProducto,
  activarProducto,
  inactivarProducto,
  obtenerProductoPorId,
  subirImagenProducto,
  obtenerProductosActivos,
  obtenerProductosPorCategoria,
} from "../controllers/productosController.js";
import  Roles  from "../config/roles.js"; 
import multer from 'multer';
import path from 'path';

import { dirname, join } from 'path';
import { fileURLToPath } from 'url';


const router = express.Router();


/**
 * @route POST /api/productos/CrearProducto
 * @desc Crear un nuevo producto
 * @access Privado (Admin)
 */
router.post(
  "/CrearProducto",
  authMiddleware,
  roleMiddleware([Roles.ADMIN]),
  crearProducto
);
/**
 * @route GET /api/productos/ObtenerProductos
 * @desc obtener los productos
 * @access Admin y Cliente
 */
router.get(
  "/ObtenerProductos",
  authMiddleware,
  roleMiddleware([Roles.ADMIN, Roles.CLIENTE]),
  obtenerProductos
);
/**
 * @route GET /api/ObtenerProductosPorId/:id
 * @desc Obtener un producto por su ID
 * @access Admin y Cliente
 */
router.get(
  "/ObtenerProductosPorId/:id",
  authMiddleware,
  roleMiddleware([Roles.ADMIN, Roles.CLIENTE]),
  obtenerProductoPorId
);

/**
 * @route GET /api/productos/ObtenerProductosPorCategoria/:idCategoria
 * @desc Obtener productos activos de una categoría específica
 * @access Admin y/o Cliente (dependiendo de tu lógica)
 */
router.get(
  "/ObtenerProductosPorCategoria/:idCategoria",
  authMiddleware,
  roleMiddleware([Roles.ADMIN, Roles.CLIENTE]),
  obtenerProductosPorCategoria
);

/**
 * @route GET /api/productos/ObtenerProductosActivos
 * @desc Obtener los productos activos
 * @access Admin y Cliente
*/
router.get(
  "/ObtenerProductosActivos",
  authMiddleware,
  roleMiddleware([Roles.ADMIN, Roles.CLIENTE]),
  obtenerProductosActivos
);

/**
 * @route PUT /api/productos/ActualizarProducto/:id
 * @desc Actualizar un producto existente
 * @access Privado (Admin)
 */
router.put(
    "/ActualizarProducto/:id",
    authMiddleware,
    roleMiddleware([Roles.ADMIN]),
    actualizarProducto
  );

  /**
 * @route PUT /api/productos/ActivarProducto/:id
 * @desc Activar un producto
 * @access Privado (Admin)
 */
router.put(
    "/ActivarProducto/:id",
    authMiddleware,
    roleMiddleware([Roles.ADMIN]),
    activarProducto
  );

  /**
 * @route PUT /api/productos/InactivarProducto/:id
 * @desc inactivr un producto existente
 * @access Privado (Admin)
 */
router.put(
    "/InactivarProducto/:id",
    authMiddleware,
    roleMiddleware([Roles.ADMIN]),
    inactivarProducto
  );

// Definir __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuración de multer para subir imagen
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const destino = join(__dirname, '../../Frontend/public/assets/productos');
    cb(null, destino);
  },
  filename: (req, file, cb) => {
    const { id } = req.params; // ID del producto
    cb(null, `${id}${path.extname(file.originalname).toLowerCase()}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Solo se permiten imágenes JPEG, JPG y PNG.'));
  },
});

// Ruta para subir imagen con manejo de errores
router.post('/subirImagen/:id', (req, res, next) => {
  upload.single('imagen')(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // Error de Multer
      console.error('Error de Multer:', err.message);
      return res.status(400).json({ error: err.message });
    } else if (err) {
      // Otro tipo de error
      console.error('Error al subir la imagen:', err.message);
      return res.status(400).json({ error: err.message });
    }
    // Si todo está bien, llamar al controlador
    subirImagenProducto(req, res);
  });
});

export default router;
