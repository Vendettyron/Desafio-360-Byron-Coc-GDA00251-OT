
/**
 * Middleware para autorizar al usuario basado en su rol
 * @param {Array} allowedRoles - Array de roles permitidos
 */

const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(Number(req.user.rol))) { // Convertir rol a número
            return res.status(403).json({ message: 'Acceso prohibido. No tienes permisos suficientes.' });
        }
        next();
    };
};

export default roleMiddleware;
