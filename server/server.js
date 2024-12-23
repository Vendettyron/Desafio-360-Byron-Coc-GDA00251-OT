// server/server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { poolPromise } from './database/DbConection.js'; // Importar la pool de conexiones

// Importar rutas
import authRoutes from './routes/auth.routes.js';
import productosRoutes from './routes/productos.routes.js';
import categoriasRoutes from './routes/categorias.routes.js';
import proveedorRoutes from './routes/proveedor.routes.js';
import estadosRoutes from './routes/estados.routes.js';
import usuariosRoutes from './routes/usuarios.routes.js';
import carritoRoutes from './routes/carrito.routes.js';
import pedidoRoutes from './routes/pedido.routes.js';

// Importar middleware de manejo de errores
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
};


//variables de entorno
dotenv.config();

const app = express();
app.use(cookieParser()); // Usar cookie-parser

// Middlewares
app.use(helmet());
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
app.use(cors(corsOptions));
// Montar las rutas
app.use('/api/auth', authRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/proveedor', proveedorRoutes);
app.use('/api/estados', estadosRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/carrito', carritoRoutes);
app.use('/api/pedido', pedidoRoutes);

app.get('/api', (req, res) => {
    res.json({ message: 'API de la tienda online' });
});

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
