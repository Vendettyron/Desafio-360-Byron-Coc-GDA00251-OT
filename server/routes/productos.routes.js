import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import {
  crearProducto,
  obtenerProductos,
  actualizarProducto,
  activarProducto,
  inactivarProducto,
} from "../controllers/productosController.js";

const router = express.Router();

/**
 * @route POST /api/CrearProducto
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
 * @route GET /api/actualizarProducto
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
 * @route PUT /api/ActualizarProducto
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
 * @route PUT /api/ActivarProducto
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
 * @route PUT /api/InactivarProducto
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
