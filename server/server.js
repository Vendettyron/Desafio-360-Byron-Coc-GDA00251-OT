// server/server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import { poolPromise } from './database/DbConection.js'; // Importar la pool de conexiones

// Importar rutas
import authRoutes from './routes/auth.routes.js';

// Importar middleware de manejo de errores

//variables de entorno
dotenv.config();

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Ruta de prueba para la base de datos
app.get('/test-db', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Productos');
        res.json(result.recordset);
    } catch (error) {
        console.error('Error en la ruta de prueba de la base de datos:', error);
        res.status(500).json({ error: 'Error al conectar con la base de datos.' });
    }
});

// Montar las rutas
app.use('/api/auth', authRoutes);

// Manejo de rutas no encontradas
app.use((req, res, next) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

// Middleware de manejo de errores globales


// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto http://localhost:${PORT}`);
});
