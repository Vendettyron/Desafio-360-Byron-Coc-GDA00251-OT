import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import roleMiddleware from '../middleware/roleMiddleware.js'
import Roles from '../config/roles.js'
import { verLog } from '../controllers/logController.js'

const router = express.Router()

/**
 * @route GET /api/log/VerLog
 * @desc Ver la información del Log (más reciente primero)
 * @access Privado (Admin)
 */
router.get(
  '/VerLog',
  authMiddleware,
  roleMiddleware([Roles.ADMIN]),
  verLog
)

export default router
