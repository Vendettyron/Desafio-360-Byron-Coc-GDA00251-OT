import express from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
import roleMiddleware from "../../middleware/roleMiddleware.js";
import {
  crearProducto,
  obtenerProductos,
  actualizarProducto,
  activarProducto,
  inactivarProducto,
  obtenerProductoPorId
} from "../../controllers/admin/productosController.js";

const router = express.Router();

/**
 * @route POST /api/admin/productos/CrearProducto
 * @desc Crear un nuevo producto
 * @access Privado (Admin)
 */
router.post(
  "/CrearProducto",
  authMiddleware,
  roleMiddleware([1]),
  crearProducto
);
/**
 * @route GET /api/admin/productos/actualizarProducto
 * @desc obtener los productos
 * @access Cualuiera
 */
router.get(
  "/obtenerProductos",
  authMiddleware,
  roleMiddleware([1, 2]),
  obtenerProductos
);
/**
 * @route GET /api/admin/productos/:id
 * @desc Obtener un producto por su ID
 * @access Privado (Admin y Cliente)
 */
router.get(
  "/ObtenerProductosPorId/:id",
  authMiddleware,
  roleMiddleware([1, 2]),
  obtenerProductoPorId
);

/**
 * @route PUT /api/admin/productos/ActualizarProducto
 * @desc Actualizar un producto existente
 * @access Privado (Admin)
 */
router.put(
    "/ActualizarProducto/:id",
    authMiddleware,
    roleMiddleware([1]),
    actualizarProducto
  );

  /**
 * @route PUT /api/admin/productos/ActivarProducto
 * @desc Activar un producto
 * @access Privado (Admin)
 */
router.put(
    "/ActivarProducto/:id",
    authMiddleware,
    roleMiddleware([1]),
    activarProducto
  );

  /**
 * @route PUT /api/admin/productos/InactivarProducto
 * @desc inactivr un producto existente
 * @access Privado (Admin)
 */
router.put(
    "/InactivarProducto/:id",
    authMiddleware,
    roleMiddleware([1]),
    inactivarProducto
  );
export default router;
