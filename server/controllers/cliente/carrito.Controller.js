import { poolPromise} from '../../database/DbConection.js';
import carritoService from '../../services/cliente/carritoService.js';

export const obtenerDetallesCarritoPorUsuario = async (req, res) => {
    const fk_id_usuario = Number(req.user.id); // Obtener el ID del usuario desde req.user JWT

    try {
        const detallesCarrito = await carritoService.obtenerDetallesCarritoPorUsuario(fk_id_usuario);
        res.json(detallesCarrito);
    } catch (error) {
        console.error('Error obteniendo detalles del carrito:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
}

export const AgregarProductoAlCarrito = async (req, res) => {
    const { cantidad } = req.body;
    const { id } = req.params; // Obtener el ID del producto desde req.params
    const pk_id_producto  = Number(id); 
    const fk_id_usuario = req.user.id; // Obtener el ID del usuario desde req.user JWT

    // Validar que se proporcionaron todos los campos necesarios
    if (!fk_id_usuario || !pk_id_producto || !cantidad) {
        return res.status(400).json({ message: 'Faltan campos obligatorios.' });
    }

    try {
        await carritoService.AgregarProductoAlCarrito({
            fk_id_usuario,
            pk_id_producto,
            cantidad
        });
        res.json({ message: 'Producto agregado al carrito.' });
    } catch (error) {
        console.error('Error agregando producto al carrito:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
}

export const EliminarDetalleCarrito = async (req, res) => {
    const { id } = req.params; // Obtener el ID del producto desde req.params
    const fk_id_producto  = Number(id); 
    const fk_id_usuario = Number(req.user.id); // Obtener el ID del usuario desde req.user JWT

    // Validar que el ID sea válido
    if (!fk_id_producto || !fk_id_usuario) {
        return res.status(400).json({ message: 'Faltan campos obligaatorios' });
    }

    try {
        await carritoService.EliminarDetalleCarrito({
            fk_id_producto,
            fk_id_usuario
        }
        );
        res.json({ message: 'Detalle del carrito eliminado.' });
    } catch (error) {
        console.error('Error eliminando detalle del carrito:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
}

export const ActualizarDetalleCarrito = async (req, res) => {
    const { nueva_cantidad } = req.body;
    const { id } = req.params; // Obtener el ID del producto desde req.params
    const fk_id_producto  = Number(id); 
    const fk_id_usuario = req.user.id; // Obtener el ID del usuario desde req.user JWT

    // Validar que se proporcionaron todos los campos necesarios
    if (!fk_id_usuario || !fk_id_producto || !nueva_cantidad) {
        return res.status(400).json({ message: 'Faltan campos obligatorios.' });
    }

    try {
        await carritoService.ActualizarDetalleCarrito({
            fk_id_usuario,
            fk_id_producto,
            nueva_cantidad
        });
        res.json({ message: 'Detalle del carrito actualizado.' });
    } catch (error) {
        console.error('Error actualizando detalle del carrito:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
}

export const ConfirmarCarrito = async (req, res) => {
    const fk_id_usuario = req.user.id; // Obtener el ID del usuario desde req.user JWT

    // Validar que se proporcionaron todos los campos necesarios
    if (!fk_id_usuario) {
        return res.status(400).json({ message: 'Faltan campos obligatorios.' });
    }

    try {
        await carritoService.ConfirmarCarrito(
            fk_id_usuario
        );
        res.json({ message: 'Carrito confirmado.' });
    } catch (error) {
        console.error('Error confirmando carrito:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
}