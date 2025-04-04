// Api que se encarga de manejar las peticiones a la API
// Almacena el token en el localStorage
import axios from 'axios';

// Define la URL base de la API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Crear una instancia de Axios con la configuración base
const api = axios.create({
  baseURL: API_URL, 
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Permitir el envío de cookies en solicitudes CORS
});

// Interceptor para añadir el token a cada solicitud
api.interceptors.request.use(
  (config) => {
    const authData = JSON.parse(localStorage.getItem('auth'));
    if (authData && authData.token) {
      config.headers.Authorization = `Bearer ${authData.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar respuestas y errores globales
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Manejar errores de autenticación globalmente
    if (error.response && error.response.status === 401) {
      // Redirigir al login si el token es inválido o expiró
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

