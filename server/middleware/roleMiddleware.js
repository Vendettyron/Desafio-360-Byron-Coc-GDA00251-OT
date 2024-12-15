/**
 * Middleware para autorizar al usuario basado en su rol
 */
const roleMiddleware = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(Number(req.user.rol))) { // Convertir rol a número
            return res.status(403).json({ message: 'Acceso prohibido. No tienes permisos suficientes.' });
        }
        next();
    };
};

export default roleMiddleware;
