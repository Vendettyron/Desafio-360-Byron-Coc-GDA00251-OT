import express from 'express';
import { login, register } from '../controllers/authController.js';
import { validateRegister } from '../middleware/validationMiddleware.js';

const router = express.Router();

/**
 * @route POST /api/auth/login
 * @desc Iniciar sesión de un usuario
 * @access Público
 */
router.post('/login', login);

/**
 * @route POST /api/auth/register
 * @desc Registrar un nuevo usuario
 * @access Público
 */
router.post('/register', validateRegister, register);
export default router;
