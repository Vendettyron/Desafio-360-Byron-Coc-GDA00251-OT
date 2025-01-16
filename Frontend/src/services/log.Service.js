import api from './api'; 

/**
 * Obtiene La informacion del Log.
 * @returns {Promise<Array>} - Lista de Logs.
 */
export const obtenerLogs = async () => {
    try {
        const response = await api.get('/log/VerLog');
        return response.data;
    } catch (error) {
        console.error('Error al obtener pedidos:', error);
        throw error;
    }
};