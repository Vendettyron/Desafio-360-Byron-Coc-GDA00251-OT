import Log from '../models/Log.js'

/**
 * @description Obtener todos los registros del Log, ordenados del más reciente al más antiguo
 * @returns {Promise<Array>} - Lista de registros de Log
 * @access Accesible para Admin
 */
export const obtenerLogSequelize = async () => {
  try {
    const logs = await Log.findAll({
      order: [['pk_id_log', 'DESC']], 
    })
    return logs
  } catch (error) {
    throw error
  }
}

export default {
  obtenerLogSequelize
}
