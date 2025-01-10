import Usuario from '../models/Usuario.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Roles from '../config/roles.js';
import Estados from '../config/estados.js';

dotenv.config();

// LOGIN
export const login = async (req, res) => {
  const { correo, password } = req.body;
  if (!correo || !password) {
    return res.status(400).json({ message: 'Correo y contraseña son obligatorios.' });
  }
  try {
    const usuario = await Usuario.findOne({
      where: {
        correo,
        fk_estado: Estados.ACTIVO
      }
    });
    if (!usuario) {
      return res.status(400).json({ message: 'Credenciales inválidas.' });
    }
    const validPassword = await bcrypt.compare(password, usuario.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Credenciales inválidas.' });
    }
    const token = jwt.sign(
      { id: usuario.pk_id_usuario, rol: usuario.fk_rol },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
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
    console.error('Error en login (Sequelize):', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

// REGISTER
export const register = async (req, res) => {
  const {
    nombre,
    apellido,
    correo,
    password,
    direccion,
    telefono,
    fk_rol = Roles.CLIENTE,
    fk_estado = Estados.ACTIVO
  } = req.body;

  if (!nombre || !apellido || !correo || !password || !direccion || !telefono) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
  }
  try {
    // Verificar si ya existe
    const usuarioExistente = await Usuario.findOne({ where: { correo } });
    if (usuarioExistente) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado.' });
    }
    // Hashear password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear usuario
    await Usuario.create({
      nombre,
      apellido,
      correo,
      password: hashedPassword,
      direccion,
      telefono,
      fk_rol,
      fk_estado
    });
    res.status(201).json({ message: 'Usuario registrado exitosamente.' });
  } catch (error) {
    console.error('Error en registro (Sequelize):', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};
