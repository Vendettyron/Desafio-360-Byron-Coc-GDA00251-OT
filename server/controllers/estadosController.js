import {
    obtenerEstadosSequelize,
    obtenerEstadoPorIdSequelize,
    crearEstadoSequelize,
    actualizarEstadoSequelize
  } from '../services/estadosService.js';
  
  /**
   * @description Obtener la lista de Estados
   * @route GET /api/estados/ObtenerEstados
   * @access Privado (Admin)
   */
  export const obtenerEstados = async (req, res) => {
    try {
      const estados = await obtenerEstadosSequelize();
      res.json(estados);
    } catch (error) {
      console.error('Error obteniendo estados (Sequelize):', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  };
  
  /**
   * @description Obtener un estado por ID
   * @route GET /api/estados/ObtenerEstadoPorId/:id
   * @access Privado (Admin)
   */
  export const obtenerEstadoPorId = async (req, res) => {
    const { id } = req.params; // id del estado
    const pk_id_estado = Number(id);
  
    if (!pk_id_estado || isNaN(pk_id_estado)) {
      return res.status(400).json({ message: 'ID del estado inválido.' });
    }
  
    try {
      const estado = await obtenerEstadoPorIdSequelize(pk_id_estado);
      if (!estado) {
        return res.status(404).json({ message: 'Estado no encontrado.' });
      }
      res.json(estado);
    } catch (error) {
      console.error('Error obteniendo estado por ID (Sequelize):', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  };
  
  /**
   * @description Crear un nuevo Estado
   * @route POST /api/estados/CrearEstado
   * @access Privado (Admin)
   */
  export const crearEstado = async (req, res) => {
    const { nombre } = req.body;
    const fk_id_usuario_operacion = req.user.id; // ID del usuario que realiza la operación
  
    if (!nombre) {
      return res.status(400).json({ message: 'Faltan campos obligatorios.' });
    }
  
    try {
      const idEstado = await crearEstadoSequelize({
        nombre,
        fk_id_usuario_operacion
      });
      res.status(201).json({ message: 'Estado creado exitosamente.', idEstado });
    } catch (error) {
      console.error('Error creando estado (Sequelize):', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  };
  
  /**
   * @description Actualizar un Estado existente
   * @route PUT /api/estados/ActualizarEstado/:id
   * @access Privado (Admin)
   */
  export const actualizarEstado = async (req, res) => {
    const { nombre } = req.body;
    const { id } = req.params; // id del estado
    const pk_id_estado = Number(id);
    const fk_id_usuario_operacion = req.user.id; // ID del usuario que realiza la operación
  
    if (!pk_id_estado || isNaN(pk_id_estado) || !nombre || !fk_id_usuario_operacion) {
      return res.status(400).json({ message: 'Faltan campos obligatorios.' });
    }
  
    try {
      const estadoActualizado = await actualizarEstadoSequelize({
        pk_id_estado,
        nombre,
        fk_id_usuario_operacion
      });
      res.json({ message: 'Estado actualizado exitosamente.', estado: estadoActualizado });
    } catch (error) {
      console.error('Error actualizando estado (Sequelize):', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  };
  