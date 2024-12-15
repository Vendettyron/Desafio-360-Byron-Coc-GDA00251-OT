import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Middleware para autenticar al usuario mediante JWT almacenado en cookies
 */
const authMiddleware = (req, res, next) => {
    const token = req.cookies.token; // Extraer el token de la cookie 'token'

    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado. No se proporcionó el token.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id: usuario.id, rol: usuario.rol }
        next();
    } catch (error) {
        console.error('Error en authMiddleware:', error);
        res.status(401).json({ message: 'Token inválido o expirado.' });
    }
};

export default authMiddleware;
