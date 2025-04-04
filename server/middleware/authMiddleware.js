import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Middleware para autenticar al usuario mediante JWT desde header o cookie
 */
const authMiddleware = (req, res, next) => {
    // Buscar token en Authorization header o en cookie
    let token = null;

    // Prioridad 1: Header Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // Prioridad 2: Cookie
    if (!token && req.cookies?.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado. No se proporcionó el token.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id, rol }
        next();
    } catch (error) {
        console.error('Error en authMiddleware:', error.message);
        return res.status(401).json({ message: 'Token inválido o expirado.' });
    }
};

export default authMiddleware;
