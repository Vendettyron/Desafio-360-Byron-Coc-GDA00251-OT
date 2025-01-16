import { obtenerLogSequelize } from '../services/logService.js'

/**
 * @description Ver la información del Log (registros recientes primero)
 * @route GET /api/log/VerLog
 * @access Privado (Admin)
 */
export const verLog = async (req, res) => {
  try {
    const logs = await obtenerLogSequelize()
    // Devolver la lista de registros
    res.status(200).json(logs)
  } catch (error) {
    console.error('Error obteniendo registros de Log:', error)
    res.status(500).json({ error: 'Error interno del servidor.' })
  }
}
