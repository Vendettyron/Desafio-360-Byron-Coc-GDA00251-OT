import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import {
  crearProducto,
  obtenerProductos,
  actualizarProducto,
  activarProducto,
  inactivarProducto,
  obtenerProductoPorId
} from "../controllers/productosController.js";
import  Roles  from "../config/roles.js"; // Assuming you have a roles.js file that exports Roles

const router = express.Router();

// Role 1: Administrador
// Role 2: Cliente

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
 * @route GET /api/productos/actualizarProducto
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
 * @route GET /api/productos/:id
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
 * @route PUT /api/productos/ActualizarProducto
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
 * @route PUT /api/productos/ActivarProducto
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
 * @route PUT /api/productos/InactivarProducto
 * @desc inactivr un producto existente
 * @access Privado (Admin)
 */
router.put(
    "/InactivarProducto/:id",
    authMiddleware,
    roleMiddleware([Roles.ADMIN]),
    inactivarProducto
  );
export default router;
