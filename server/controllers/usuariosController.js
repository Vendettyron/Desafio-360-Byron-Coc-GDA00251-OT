import {
    obtenerUsuarioPorIdSequelize,
    obtenerUsuariosSequelize,
    actualizarUsuarioSequelize,
    actualizarUsuarioElMismoSequelize,
    actualizarPasswordUsuarioSequelize,
    inactivarUsuarioSequelize,
    activarUsuarioSequelize,
    inactivarUsuarioElMismoSequelize,
  } from '../services/usuariosService.js';
  
  import bcrypt from 'bcrypt';
  
  /**
   * @description Obtener un usuario por su ID
   * @route GET /api/usuarios/ObtenerUsuarioPorId/:id
   * @access Admin
   */
  export const ObtenerUsuarioPorId = async (req, res) => {
    const { id } = req.params;
    const pk_id_usuario = Number(id);
  
    if (!pk_id_usuario) {
      return res.status(400).json({ message: 'ID del usuario inválido.' });
    }
  
    try {
      const usuario = await obtenerUsuarioPorIdSequelize(pk_id_usuario);
      if (!usuario) {
        return res.status(404).json({ message: 'Usuario no encontrado.' });
      }
      res.json(usuario);
    } catch (error) {
      console.error('Error obteniendo usuario por ID (Sequelize):', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  };
  
  /**
   * @description Obtener la lista de usuarios
   * @route GET /api/usuarios/ObtenerUsuarios
   * @access Admin
   */
  export const obtenerUsuarios = async (req, res) => {
    try {
      const usuarios = await obtenerUsuariosSequelize();
      res.json(usuarios);
    } catch (error) {
      console.error('Error obteniendo Usuarios (Sequelize):', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  };
  
  /**
   * @description Actualizar un usuario existente (Admin)
   * @route PUT /api/usuarios/ActualizarUsuario/:id
   * @access Admin
   */
  export const actualizarUsuario = async (req, res) => {
    const { id } = req.params;
    const id_usuario = Number(id); // ID del usuario a actualizar
    const {
      nombre,
      apellido,
      direccion,
      correo,
      telefono,
      password,
      fk_rol,
      fk_estado
    } = req.body;
    const fk_id_usuario = req.user.id; // ID del admin que hace la operación
  
    if (!id_usuario || !nombre || !apellido || !direccion || !correo || !telefono || !password || !fk_rol || !fk_estado || !fk_id_usuario) {
      return res.status(400).json({ message: 'Faltan campos obligatorios o datos inválidos.' });
    }
  
    try {
      await actualizarUsuarioSequelize({
        id_usuario,
        nombre,
        apellido,
        direccion,
        correo,
        telefono,
        password,
        fk_rol,
        fk_estado,
        fk_id_usuario,
      });
      res.json({ message: 'Usuario actualizado exitosamente.' });
    } catch (error) {
      console.error('Error actualizando usuario (Sequelize):', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  };
  
  /**
   * @description El usuario actualiza su propia cuenta (sin cambiar rol/estado/password)
   * @route PUT /api/usuarios/ActualizarUsuarioElMismo
   * @access Cliente
   */
  export const actualizarUsuarioElMismo = async (req, res) => {
    const {
      nombre,
      apellido,
      direccion,
      correo,
      telefono
    } = req.body;
    const pk_id_usuario = req.user.id; // ID del usuario obtenido del token
  
    if (!nombre || !apellido || !direccion || !correo || !telefono || !pk_id_usuario) {
      return res.status(400).json({ message: 'Faltan campos obligatorios o datos inválidos.' });
    }
  
    try {
      await actualizarUsuarioElMismoSequelize({
        pk_id_usuario,
        nombre,
        apellido,
        direccion,
        correo,
        telefono,
      });
      res.json({ message: 'Usuario actualizado exitosamente.' });
    } catch (error) {
      console.error('Error actualizando usuario (Sequelize):', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  };
  
  /**
   * @description El usuario actualiza su contraseña
   * @route PUT /api/usuarios/ActualizarPassword
   * @access Cliente
   */
  export const actualizarPasswordUsuario = async (req, res) => {
    const { actualPassword, newPassword } = req.body;
    const pk_id_usuario = req.user.id; // ID del usuario obtenido del token
  
    if (!actualPassword || !newPassword || !pk_id_usuario) {
      return res.status(400).json({ message: 'Faltan campos obligatorios o datos inválidos.' });
    }
  
    try {
      // 1. Verificar la contraseña actual
      const usuario = await obtenerUsuarioPorIdSequelize(pk_id_usuario);
      if (!usuario) {
        return res.status(404).json({ message: 'Usuario no encontrado.' });
      }
  
      const passwordValida = await bcrypt.compare(actualPassword, usuario.password);
      if (!passwordValida) {
        return res.status(401).json({ message: 'Contraseña es incorrecta.' });
      }
  
      // 2. Actualizar la contraseña
      await actualizarPasswordUsuarioSequelize({
        pk_id_usuario,
        newPassword
      });
      res.json({ message: 'Contraseña actualizada exitosamente.' });
    } catch (error) {
      console.error('Error actualizando contraseña (Sequelize):', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  };

    /**
     * @description Activar un usuario existente (ADMIN)
     * @route PUT /api/usuarios/ActivarUsuario/:id
     * @access Admin
     */
    export const activarUsuario = async (req, res) => {
        const { id } = req.params;
        const pk_id_usuario = Number(id);
        const id_usuario_accion = req.user.id;
        
        if (!pk_id_usuario || !id_usuario_accion) {
            return res.status(400).json({ message: 'Faltan campos obligatorios o datos inválidos.' });
        }
        
        try {
            await activarUsuarioSequelize({
            pk_id_usuario,
            id_usuario_accion
            });
            res.json({ message: 'Usuario activado exitosamente.' });
        } catch (error) {
            console.error('Error activando usuario (Sequelize):', error);
            res.status(500).json({ error: 'Error interno del servidor.' });
        }
    };
      
  /**
   * @description Inactivar un usuario existente (ADMIN)
   * @route PUT /api/usuarios/InactivarUsuario/:id
   * @access Admin
   */
  export const inactivarUsuario = async (req, res) => {
    const { id } = req.params;
    const id_usuario = Number(id);
    const fk_id_usuario = req.user.id; // Admin que hace la operación
  
    if (!id_usuario || !fk_id_usuario) {
      return res.status(400).json({ message: 'Faltan campos obligatorios o datos inválidos.' });
    }
  
    try {
      await inactivarUsuarioSequelize({
        id_usuario,
        fk_id_usuario
      });
      res.json({ message: 'Usuario inactivado exitosamente.' });
    } catch (error) {
      console.error('Error inactivando usuario (Sequelize):', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  };
  
  /**
   * @description El usuario inactiva su propia cuenta, verificando su correo y password
   * @route PUT /api/usuarios/InactivarUsuarioElMismo
   * @access Cliente
   */
  export const inactivarUsuarioElMismo = async (req, res) => {
    const { correo, password } = req.body;
    const pk_id_usuario = req.user.id;
  
    if (!correo || !password) {
      return res.status(400).json({ message: 'Se requieren el correo y la contraseña.' });
    }
  
    try {
      await inactivarUsuarioElMismoSequelize({
        pk_id_usuario,
        correo,
        password
      });
      res.json({ message: 'Cuenta inactivada exitosamente.' });
    } catch (error) {
      console.error('Error inactivarUsuarioElMismo (Sequelize):', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  };
  
