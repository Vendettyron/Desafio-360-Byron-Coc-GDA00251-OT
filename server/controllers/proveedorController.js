import {
    crearProveedorSequelize,
    actualizarProveedorSequelize,
    activarProveedorSequelize,
    inactivarProveedorSequelize,
    obtenerProveedorPorIdSequelize,
    obtenerProveedoresSequelize,
  } from '../services/proveedorService.js';
  
  /**
   * @description Obtener todos los proveedores
   * @route GET /api/proveedor/ObtenerProveedores
   * @access Admin y Cliente
   */
  export const obtenerProveedor = async (req, res) => {
    try {
      const proveedores = await obtenerProveedoresSequelize();
      res.json(proveedores);
    } catch (error) {
      console.error('Error obteniendo proveedores (Sequelize):', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  };
  
  /**
   * @description Obtener un proveedor por ID
   * @route GET /api/proveedor/ObtenerProveedorPorId/:id
   * @access Admin, Cliente
   */
  export const obtenerProveedorPorId = async (req, res) => {
    const { id } = req.params; // ID del proveedor
    const pk_id_proveedor = Number(id);
  
    if (!pk_id_proveedor || isNaN(pk_id_proveedor)) {
      return res.status(400).json({ message: 'ID del proveedor inválido.' });
    }
  
    try {
      const proveedor = await obtenerProveedorPorIdSequelize(pk_id_proveedor);
      if (!proveedor) {
        return res.status(404).json({ message: 'Proveedor no encontrado.' });
      }
      res.json(proveedor);
    } catch (error) {
      console.error('Error obteniendo proveedor por ID (Sequelize):', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  };
  
  /**
   * @description Crear un nuevo proveedor
   * @route POST /api/proveedor/CrearProveedor
   * @access Admin
   */
  export const crearProveedor = async (req, res) => {
    const { nombre, telefono, correo, fk_estado } = req.body;
    const fk_id_usuario = req.user.id; // ID del usuario (admin) que crea
  
    if (!nombre || !telefono || !correo || !fk_estado || !fk_id_usuario) {
      return res.status(400).json({ message: 'Faltan campos obligatorios.' });
    }
  
    try {
      const idProveedor = await crearProveedorSequelize({
        nombre,
        telefono,
        correo,
        fk_estado,
        fk_id_usuario
      });
      res.status(201).json({
        message: 'Proveedor creado exitosamente.',
        idProveedor
      });
    } catch (error) {
      console.error('Error creando proveedor (Sequelize):', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  };
  
  /**
   * @description Actualizar un proveedor existente
   * @route PUT /api/proveedor/ActualizarProveedor/:id
   * @access Admin
   */
  export const actualizarProveedor = async (req, res) => {
    const { nombre, telefono, correo, fk_estado } = req.body;
    const { id } = req.params; // ID del proveedor
    const pk_id_proveedor = Number(id);
    const fk_id_usuario = req.user.id; // ID del usuario (admin) que actualiza
  
    if (!pk_id_proveedor || isNaN(pk_id_proveedor) || !nombre || !telefono || !correo || !fk_estado || !fk_id_usuario) {
      return res.status(400).json({ message: 'Faltan campos obligatorios o datos inválidos.' });
    }
  
    try {
      const proveedorActualizado = await actualizarProveedorSequelize({
        pk_id_proveedor,
        nombre,
        telefono,
        correo,
        fk_estado,
        fk_id_usuario
      });
      res.json({
        message: 'Proveedor actualizado exitosamente.',
        proveedor: proveedorActualizado
      });
    } catch (error) {
      console.error('Error actualizando proveedor (Sequelize):', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  };
  
  /**
   * @description Activar un proveedor
   * @route PUT /api/proveedor/ActivarProveedor/:id
   * @access Admin
   */
  export const activarProveedor = async (req, res) => {
    const { id } = req.params; // ID del proveedor
    const pk_id_proveedor = Number(id);
    const id_usuario_accion = req.user.id; // ID del usuario (admin) que activa
  
    if (!pk_id_proveedor || isNaN(pk_id_proveedor) || !id_usuario_accion) {
      return res.status(400).json({ message: 'Faltan campos obligatorios.' });
    }
  
    try {
      const proveedorActivado = await activarProveedorSequelize({
        pk_id_proveedor,
        id_usuario_accion
      });
      res.json({
        message: 'Proveedor activado exitosamente.',
        proveedor: proveedorActivado
      });
    } catch (error) {
      console.error('Error activando proveedor (Sequelize):', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  };
  
  /**
   * @description Inactivar un proveedor
   * @route PUT /api/proveedor/InactivarProveedor/:id
   * @access Admin
   */
  export const inactivarProveedor = async (req, res) => {
    const { id } = req.params; // ID del proveedor
    const id_proveedor = Number(id);
    const fk_id_usuario = req.user.id; // ID del usuario (admin) que inactiva
  
    if (!id_proveedor || isNaN(id_proveedor) || !fk_id_usuario) {
      return res.status(400).json({ message: 'Faltan campos obligatorios.' });
    }
  
    try {
      const proveedorInactivado = await inactivarProveedorSequelize({
        id_proveedor,
        fk_id_usuario
      });
      res.json({
        message: 'Proveedor inactivado exitosamente.',
        proveedor: proveedorInactivado
      });
    } catch (error) {
      console.error('Error inactivando proveedor (Sequelize):', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  };
  