import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import { obtenerProductosClientes } from '../controllers/productosClientesController.js';

const router = express.Router();

/**
 * @route GET /api/productos
 * @desc Obtener la lista de productos
 * @access Privado (Autenticado)
 */
router.get('/', authMiddleware,roleMiddleware([1,2]), obtenerProductosClientes);

export default router;
