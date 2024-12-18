import { poolPromise} from '../../database/DbConection.js';
import proveedoresService from '../../services/admin/proveedorService.js';

export const obtenerProveedor = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
        .query('SELECT * FROM Proveedor'); //  consulta

        res.json(result.recordset);
    } catch (error) {
        console.error('Error obteniendo proveedores:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
}


export const obtenerProveedorPorId = async (req, res) => {
   const { id } = req.params; // Obtener el ID del proveedor desde req.params
   const pk_id_proveedor = Number(id); // Convertir a número

    // Validar que el ID sea válido
    if (!pk_id_proveedor || isNaN(pk_id_proveedor)) {
        return res.status(400).json({ message: 'ID del proveedor invalido.' });
    }

   try{
         const proveedor = await proveedoresService.obtenerProveedorPorId(pk_id_proveedor);
         if(!proveedor){
              return res.status(404).json({ message: 'Proveedor no encontrado.' });
         }
         res.json(proveedor);
   }catch (error) {
        console.error('Error obteniendo proveeeedor por ID:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
}

/**
 * Crear un nuevo proveedor
 * Accesible solo para Admin
 */
export const crearProveedor = async (req, res) => {
    const { nombre, telefono, correo, fk_estado } = req.body;
    const fk_id_usuario = req.user.id; // Obtener el ID del usuario desde req.user

    // Validar que se proporcionaron todos los campos necesarios
    if (!nombre || !telefono || !correo || !fk_estado || !fk_id_usuario) {
        return res.status(400).json({ message: 'Faltan campos obligatorios.' });
    }

    try {
        await proveedoresService.crearProveedor({
            nombre,
            telefono,
            correo,
            fk_estado,
            fk_id_usuario
        });

        res.status(201).json({ message: 'Proveedor creado exitosamente.' });
    } catch (error) {
        console.error('Error creando proveedor:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

/**
 * Actualizar un proveedor existente
 * Accesible solo para Admin
 */
export const actualizarProveedor = async (req, res) => {
    const { nombre, telefono, correo, fk_estado } = req.body;
    const { id } = req.params; // Obtener el ID del proveedor desde req.params
    const pk_id_proveedor = Number(id); // Convertir a número
    const fk_id_usuario = req.user.id; // Obtener el ID del usuario desde req.user

    // Validar que se proporcionaron todos los campos necesarios
    if (!pk_id_proveedor || isNaN(pk_id_proveedor) || !nombre || !telefono || !correo || !fk_estado || !fk_id_usuario) {
        return res.status(400).json({ message: 'Faltan campos obligatorios o los datos son inválidos.' });
    }

    try {
        await proveedoresService.actualizarProveedor({
            pk_id_proveedor,
            nombre,
            telefono,
            correo,
            fk_estado,
            fk_id_usuario
        });

        res.json({ message: 'Proveedor actualizado exitosamente.' });
    } catch (error) {
        console.error('Error actualizando proveedor:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

/**
 * Activar un proveedor existente
 * Accesible solo para Admin
 */
export const activarProveedor = async (req, res) => {
    const { id } = req.params; // Obtener el ID del proveedor desde req.params
    const pk_id_proveedor = Number(id); // Convertir a número
    const id_usuario_accion = req.user.id; // Obtener el ID del usuario desde req.user

    // Validar que se proporcionaron todos los campos necesarios
    if (!pk_id_proveedor || isNaN(pk_id_proveedor) || !id_usuario_accion) {
        return res.status(400).json({ message: 'Faltan campos obligatorios o los datos son inválidos.' });
    }

    try {
        await proveedoresService.activarProveedor({
            pk_id_proveedor,
            id_usuario_accion
        });

        res.json({ message: 'Proveedor activado exitosamente.' });
    } catch (error) {
        console.error('Error activando proveedor:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

/**
 * Inactivar un proveedor existente
 * Accesible solo para Admin
 */
export const inactivarProveedor = async (req, res) => {
    const { id } = req.params; // Obtener el ID del proveedor desde req.params
    const id_proveedor = Number(id); // Convertir a número
    const fk_id_usuario = req.user.id; // Obtener el ID del usuario desde req.user

    // Validar que se proporcionaron todos los campos necesarios
    if (!id_proveedor || isNaN(id_proveedor) || !fk_id_usuario) {
        return res.status(400).json({ message: 'Faltan campos obligatorios o los datos son inválidos.' });
    }

    try {
        await proveedoresService.inactivarProveedor({
            id_proveedor,
            fk_id_usuario
        });

        res.json({ message: 'Proveedor inactivado exitosamente.' });
    } catch (error) {
        console.error('Error inactivando proveedor:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};