import carritoService from '../services/carritoService.js';

// Obtener detalles del carrito para el cliente actual en sesion

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

// Obtener detalles del carrito para un usuario especifico (admin)

export const obtenerDetallesCarritoPorUsuarioAdmin = async (req, res) => {
    const fk_id_usuario = Number(req.params.id); // Obtener el ID del usuario desde req.params

    try {
        const detallesCarrito = await carritoService.obtenerDetallesCarritoPorUsuario(fk_id_usuario);
        res.json(detallesCarrito);
    } catch (error) {
        console.error('Error obteniendo detalles del carrito:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
}

// Agregar un producto al carrito, en dado caso no exista el carrito se crea uno nuevo

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

export const AgregarProductoAlCarritoAdmin = async (req, res) => {
    const { cantidad } = req.body;
    const { idUsuario,idProducto } = req.params; // Obtener el ID del producto y del usuario desde req.params
    const pk_id_producto  = Number(idProducto); 
    const fk_id_usuario = Number(idUsuario); // Obtener el ID del usuario desde req.user JWT

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

// Eliminar un detalle especifico del carrito

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

export const EliminarDetalleCarritoAdmin = async (req, res) => {
    const { idUsuario,idProducto } = req.params; // Obtener el ID del producto y del usuario desde req.params
    const fk_id_producto  = Number(idProducto); 
    const fk_id_usuario = Number(idUsuario); // Obtener el ID del usuario desde req.user JWT

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

// Eliminar todos los detalles del carrito

export const EliminarDetallesCarrito = async (req, res) => {
    const fk_id_usuario = Number(req.user.id); // Obtener el ID del usuario desde req.user JWT

    try {
        await carritoService.EliminarDetallesCarrito(fk_id_usuario);
        res.json({ message: 'Todos los detalles del carrito eliminados.' });
    } catch (error) {
        console.error('Error eliminando todos los detalles del carrito:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
}

export const EliminarDetallesCarritoAdmin = async (req, res) => {
    const fk_id_usuario = Number(req.params.id); // Obtener el ID del usuario desde req.params

    try {
        await carritoService.EliminarDetallesCarrito(fk_id_usuario);
        res.json({ message: 'Todos los detalles del carrito eliminados.' });
    } catch (error) {
        console.error('Error eliminando todos los detalles del carrito:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
}

// Actualizar un detalle del carrito (cantidad)

export const ActualizarDetalleCarrito = async (req, res) => {
    const { nueva_cantidad } = req.body;
    const { id } = req.params; // Obtener el ID del producto desde req.params
    const fk_id_producto  = Number(id); 
    const fk_id_usuario = req.user.id; // Obtener el ID del usuario desde req.user JWT

    // Validar que se proporcionaron todos los campos necesarios
    if (!fk_id_usuario || !fk_id_producto || isNaN(nueva_cantidad)) {
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

// Actualizar un detalle del carrito (cantidad) para un usuario especifico (admin)

export const ActualizarDetalleCarritoAdmin = async (req, res) => {
    const { nueva_cantidad } = req.body; // Obtener la nueva cantidad desde req.body
    const { idUsuario,idProducto } = req.params;  // Obtener el ID del producto y del usuario desde req.params

    const fk_id_producto  = Number(idProducto);
    const fk_id_usuario = Number(idUsuario);

    // Validar que se proporcionaron todos los campos necesarios
    if (!fk_id_usuario || !fk_id_producto || isNaN(nueva_cantidad)) {
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

// Confirmar un carrito para que se vuelva un Pedido

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