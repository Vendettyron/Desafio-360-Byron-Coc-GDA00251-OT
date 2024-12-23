// src/services/authService.js

import api from './api';

/**
 * Función para iniciar sesión.
 * @param {string} correo - Correo electrónico del usuario.
 * @param {string} password - Contraseña del usuario.
 * @returns {Promise<Object>} - Respuesta del servidor que incluye el token y datos del usuario.
 */
export const login = async (correo, password) => {
  try {
    const response = await api.post('/auth/login', { correo, password });
    return response.data; // Suponiendo que la respuesta contiene { token, user }
  } catch (error) {
    throw error;
  }
};

/**
 * Función para registrar un nuevo usuario.
 * @param {Object} userData - Datos del usuario a registrar.
 * @returns {Promise<Object>} - Respuesta del servidor.
 */
export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data; // Suponiendo que la respuesta contiene { token, user }
  } catch (error) {
    throw error;
  }
};
