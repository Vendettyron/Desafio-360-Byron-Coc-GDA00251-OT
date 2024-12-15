// middlewaree para validar los campos de registro de usuario
export const validateRegister = (req, res, next) => {
    const { nombre, apellido, correo, password, direccion, telefono } = req.body;

    if (!nombre || !apellido || !correo || !password || !direccion || !telefono) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    // Validar formato del correo electrónico
    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!correoRegex.test(correo)) {
        return res.status(400).json({ message: 'Correo electrónico inválido.' });
    }

    // Validar longitud mínima de la contraseña
    if (password.length < 6) {
        return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres.' });
    }


    next(); 
};
