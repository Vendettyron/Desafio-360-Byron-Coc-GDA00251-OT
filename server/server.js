import express from 'express';
import dotenv from 'dotenv';
//variables de entorno
dotenv.config();
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import sequelize from './config/dbSequelize.js';
import './models/associations.js'; // Importar las asociaciones de los modelos

// Importar rutas
import authRoutes from './routes/auth.routes.js';
import productosRoutes from './routes/productos.routes.js';
import categoriasRoutes from './routes/categorias.routes.js';
import proveedorRoutes from './routes/proveedor.routes.js';
import estadosRoutes from './routes/estados.routes.js';
//import usuariosRoutes from './routes/usuarios.routes.js';
//import carritoRoutes from './routes/carrito.routes.js';
//import pedidoRoutes from './routes/pedido.routes.js';

// Importar middleware de manejo de errores
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
};



const app = express();

// Middlewares
app.use(helmet());
app.use(express.json());
app.use(cookieParser()); // Usar cookie-parser

app.use(cors(corsOptions));
// Montar las rutas
app.use('/api/auth', authRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/proveedor', proveedorRoutes);
app.use('/api/estados', estadosRoutes);
//app.use('/api/usuarios', usuariosRoutes);
//app.use('/api/carrito', carritoRoutes);
//app.use('/api/pedido', pedidoRoutes);

app.get('/api', (req, res) => {
    res.json({ message: 'API de la tienda online' });
});

// Manejo de rutas no encontradas
app.use((req, res, next) => {
    res.status(404).json({ message: 'Ruta no encontrada o no importada desde server' });
});

// Middleware de manejo de errores globales


// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto http://localhost:${PORT}`);
});
