import { poolPromise, sql } from '../database/DbConection.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Roles from '../config/roles.js';
import Estados from '../config/estados.js';

dotenv.config();

// Iniciar sesión de un usuario
export const login = async (req, res) => {
    const { correo, password } = req.body;

    // Validar que se proporcionaron correo y contraseña
    if (!correo || !password) {
        return res.status(400).json({ message: 'Correo y contraseña son obligatorios.' });
    }

    try {
        const pool = await poolPromise;

        // Consultar al usuario por correo y estado activo
        const result = await pool.request()
            .input('correo', sql.VarChar(100), correo)
            .query('SELECT * FROM Usuarios WHERE correo = @correo AND fk_estado = 1');

        if (result.recordset.length === 0) {
            return res.status(400).json({ message: 'Credenciales inválidas.' });
        }

        const usuario = result.recordset[0];

        // Comparar la contraseña proporcionada con la almacenada
        const validPassword = await bcrypt.compare(password, usuario.password);

        if (!validPassword) {
            return res.status(400).json({ message: 'Credenciales inválidas.' });
        }

        // Generar el token JWT
        const token = jwt.sign(
            { id: usuario.pk_id_usuario, rol: Number(usuario.fk_rol) },
            process.env.JWT_SECRET,
            { expiresIn: '24h' } // Token válido por 24 horas
        );

        // Enviar el token como una cookie httpOnly
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Usa secure en producción
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000, // 24 horas
            path: '/', 
        });

        return res.json({ 
            token,
            usuario: {
                id: usuario.pk_id_usuario,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                direccion: usuario.direccion,
                telefono: usuario.telefono,
                correo: usuario.correo,
                fk_rol: usuario.fk_rol,
                fk_estado: usuario.fk_estado
            }
        });
        
          
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};


// Registro de un nuevo usuario
export const register = async (req, res) => {
    // asignar default CLIENTE y ACTIVO
    const { nombre, apellido, correo, password, direccion, telefono, fk_rol = Roles.CLIENTE, fk_estado = Estados.ACTIVO } = req.body;

    // Validar que se proporcionaron todos los campos necesarios
    if (!nombre || !apellido || !correo || !password || !direccion || !telefono || !fk_rol || !fk_estado) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    try {
        const pool = await poolPromise;

        // Verificar si el usuario ya existe
        const usuarioExistente = await pool.request()
            .input('correo', sql.VarChar(100), correo)
            .query('SELECT * FROM Usuarios WHERE correo = @correo');

        if (usuarioExistente.recordset.length > 0) {
            return res.status(400).json({ message: 'El correo electrónico ya está registrado.' });
        }

        // Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insertar el nuevo usuario en la base de datos
        await pool.request()
            .input('nombre', sql.VarChar(100), nombre)
            .input('apellido', sql.VarChar(100), apellido)
            .input('correo', sql.VarChar(100), correo)
            .input('password', sql.VarChar(255), hashedPassword)
            .input('direccion', sql.VarChar(255), direccion)
            .input('telefono', sql.VarChar(15), telefono)
            .input('fk_rol', sql.Int, fk_rol) 
            .input('fk_estado', sql.Int, fk_estado) 
            .execute('InsertarUsuario'); // Ejecutar el SP

        res.status(201).json({ message: 'Usuario registrado exitosamente.' });
    } catch (error) {
        console.error('Error en registro:', error);

        // Manejar errores específicos del SP
        if (error.number === 50000) { // RAISERROR con severidad 16
            return res.status(400).json({ message: error.message });
        }

        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};