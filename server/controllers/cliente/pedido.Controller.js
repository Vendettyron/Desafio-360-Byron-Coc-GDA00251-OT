import pedidoService from '../../services/cliente/pedidoService.js';

export const obtenerPedidosCliente = async (req, res) => {
    const fk_cliente = req.user.id; // Obtener el ID del usuario desde req.user JWT

    try {
        const pedidos = await pedidoService.obtenerPedidosCliente(fk_cliente);
        res.status(200).json(pedidos);
    } catch (error) {
        console.error('Error al obtener pedidos del cliente:', error);
        return res.status(500).json({ error: 'Error interno del servidor.' });
    }
};


export const obtenerDetallesPedidoCliente = async (req, res) => {
    const fk_id_usuario = req.user.id; // Obtener el ID del usuario desde req.user
    const { id } = req.params; // Obtener el ID del pedido desde req.params
    const pk_id_pedido = Number(id); // Convertir a número

    try {
        const detallesPedido = await pedidoService.obtenerDetallesPedidoCliente({
            fk_id_usuario,
            pk_id_pedido
        });
        res.status(200).json(detallesPedido);
    } catch (error) {
        console.error('Error al obtener detalles del pedido del cliente:', error);
        // Manejo de errores personalizados basado en el número de error lanzado
        if (error.number === 50000) {
            return res.status(404).json({ error: 'No existe un pedido en estado "En proceso" para este usuario.' });
        } else {
            return res.status(500).json({ error: 'Error interno del servidor.' });
        }
    }
}

/**
 * Actualizar un detalle en el pedido del usuario o eliminarlo si la nueva cantidad es 0
 */
export const actualizarDetallePedido = async (req, res) => {
    const { nueva_cantidad } = req.body;
    const { pedidoId,productoId } = req.params; // Obtener el ID del Pedido desde req.params
    const fk_id_usuario = req.user.id; // Obtener el ID del usuario desde req.user JWT

    // Validar los datos de entrada
    if (
        isNaN(nueva_cantidad) 
    ) {
        return res.status(400).json({
            message: 'Datos inválidos. Asegúrate de proporcionar un ID de producto válido y una cantidad numérica.',
        });
    }

    try {
        await pedidoService.actualizarDetallePedido({
            fk_id_usuario,
            fk_id_pedido: parseInt(pedidoId, 10),
            fk_id_producto: parseInt(productoId, 10),
            nueva_cantidad
        });
        res.status(200).json({
            message: nueva_cantidad === 0
                ? 'Detalle del pedido eliminado exitosamente.'
                : 'Detalle del pedido actualizado exitosamente.',
        });
    } catch (error) {
        console.error('Error al actualizar/eliminar detalle del pedido:', error);
        // Manejo de errores personalizados basado en el número de error lanzado
        if (error.number === 50000) {
            return res.status(404).json({ error: 'No existe un pedido en estado "En proceso" para este usuario.' });
        } else if (error.number === 50001) {
            return res.status(400).json({ error: 'Solo se pueden actualizar detalles de pedidos en estado "En proceso".' });
        } else if (error.number === 50002) {
            return res.status(404).json({ error: 'El producto especificado no existe o no está activo.' });
        } else if (error.number === 50003) {
            return res.status(400).json({ error: 'La cantidad no puede ser negativa.' });
        } else if (error.number === 50004) {
            return res.status(404).json({ error: 'El producto especificado no existe en el pedido.' });
        } else {
            return res.status(500).json({ error: 'Error interno del servidor.' });
        }
    }
};

/**
 * Eliminar un detalle en el pedido del usuario
 */
export const eliminarDetallePedido = async (req, res) => {
    const { pedidoId,productoId } = req.params; // Obtener el ID del Pedido y del producto desde req.params
    const fk_id_usuario = req.user.id; // Obtener el ID del usuario desde req.user

    // Validar los datos de entrada
    if (
        isNaN(pedidoId) || isNaN(productoId)
    ) {
        return res.status(400).json({
            message: 'Datos inválidos. Asegúrate de proporcionar un ID de producto válido.',
        });
    }

    try {
        await pedidoService.eliminarDetallePedido({
            fk_id_usuario,
            fk_id_pedido: parseInt(pedidoId, 10),
            fk_id_producto: parseInt(productoId, 10)
        });
        res.status(200).json({
            message: 'Detalle del pedido eliminado exitosamente.',
        });
    } catch (error) {
        console.error('Error al eliminar detalle del pedido:', error);
        // Manejo de errores personalizados basado en el número de error lanzado
        if (error.number === 50000) {
            return res.status(404).json({ error: 'No existe un pedido en estado "En proceso" para este usuario.' });
        } else if (error.number === 50001) {
            return res.status(400).json({ error: 'Solo se pueden eliminar detalles de pedidos en estado "En proceso".' });
        } else if (error.number === 50002) {
            return res.status(404).json({ error: 'El producto especificado no existe en el pedido.' });
        } else {
            return res.status(500).json({ error: 'Error interno del servidor.' });
        }
    }
};

/**
 * Cancelar el pedido en estado "En proceso" del cliente
 */
export const cancelarPedidoCliente = async (req, res) => {
    const fk_id_cliente = req.user.id; // Obtener el ID del cliente desde req.user
    const { id } = req.params;
    try {
        await pedidoService.cancelarPedidoCliente({
            fk_id_cliente,
            fk_id_pedido: parseInt(id, 10)
        });
        res.status(200).json({
            message: 'Pedido cancelado exitosamente.',
        });
    } catch (error) {
        console.error('Error al cancelar el pedido:', error);
        // Manejo de errores personalizados basado en el número de error lanzado
        if (error.number === 50000) {
            return res.status(404).json({ error: 'No existe un pedido en estado "En proceso" para este usuario.' });
        } else if (error.number === 50001) {
            return res.status(400).json({ error: 'Solo se pueden cancelar pedidos en estado "En proceso".' });
        } else {
            return res.status(500).json({ error: 'Error interno del servidor.' });
        }
    }
};

/**
 * Aprobar un pedido (admin)
 */
export const aprobarPedido = async (req, res) => {
    const { id } = req.params;
    const fk_id_usuario_operacion = req.user.id; // Obtener el ID del usuario desde req.user JWT
    // Validar los datos de entrada
    if (
        isNaN(id)
    ) {
        return res.status(400).json({
            message: 'Datos inválidos. Asegúrate de proporcionar un ID de pedido válido.',
        });
    }

    try {
        await pedidoService.aprobarPedido({
            pk_id_pedido: parseInt(id, 10),
            fk_id_usuario_operacion
        });
        res.status(200).json({
            message: 'Pedido aprobado exitosamente.',
        });
    } catch (error) {
        console.error('Error al aprobar el pedido:', error);
        // Manejo de errores personalizados basado en el número de error lanzado
        if (error.number === 50000) {
            return res.status(404).json({ error: 'El pedido especificado no existe.' });
        } else if (error.number === 50001) {
            return res.status(400).json({ error: 'Solo se pueden aprobar pedidos en estado "En proceso".' });
        } else {
            return res.status(500).json({ error: 'Error interno del servidor.' });
        }
    }
};

/**
 * Cancelar un pedido como administrador
 */
export const cancelarPedidoAdministrador = async (req, res) => {
    const { id } = req.params;
    const fk_id_usuario_operacion = req.user.id; // ID del administrador desde req.user

    // Validar los datos de entrada
    if (
        isNaN(id)
    ) {
        return res.status(400).json({
            message: 'Datos inválidos. Asegúrate de proporcionar un ID de pedido válido.',
        });
    }

    try {
        await pedidoService.cancelarPedidoAdministrador({
            pk_id_pedido: parseInt(id, 10),
            fk_id_usuario_operacion
        });
        res.status(200).json({
            message: 'Pedido cancelado exitosamente.',
        });
    } catch (error) {
        console.error('Error al cancelar el pedido como administrador:', error);
        // Manejo de errores personalizados basado en el número de error lanzado
        if (error.number === 50000) {
            return res.status(404).json({ error: 'El pedido especificado no existe.' });
        } else if (error.number === 50001) {
            return res.status(400).json({ error: 'Solo se pueden cancelar pedidos en estado "En proceso".' });
        } else {
            return res.status(500).json({ error: 'Error interno del servidor.' });
        }
    }
};



/**
 * Insertar un detalle en el pedido del usuario
 */
export const insertarDetallePedido = async (req, res) => {
    const { cantidad } = req.body;
    const { pedidoId,productoId } = req.params; // Obtener el ID del Pedido desde req.params
    const fk_id_usuario = req.user.id; // Obtener el ID del usuario desde req.user JWT

    // Validar los datos de entrada
    if (
        isNaN(cantidad) 
    ) {
        return res.status(400).json({
            message: 'Datos inválidos. Asegúrate de proporcionar un ID de producto válido y una cantidad numérica.',
        });
    }

    try {
        await pedidoService.insertarDetallePedido({
            fk_id_usuario,
            fk_id_pedido: parseInt(pedidoId, 10),
            fk_id_producto: parseInt(productoId, 10),
            cantidad
        });
        res.status(201).json({
            message: 'Detalle del pedido insertado exitosamente.',
        });
    } catch (error) {
        console.error('Error al insertar detalle del pedido:', error);
        // Manejo de errores personalizados basado en el número de error lanzado
        if (error.number === 50000) {
            return res.status(404).json({ error: 'No existe un pedido en estado "En proceso" para este usuario.' });
        } else if (error.number === 50001) {
            return res.status(400).json({ error: 'Solo se pueden agregar detalles a pedidos en estado "En proceso".' });
        } else if (error.number === 50002) {
            return res.status(404).json({ error: 'El producto especificado no existe o no está activo.' });
        } else if (error.number === 50003) {
            return res.status(400).json({ error: 'La cantidad debe ser mayor a cero.' });
        } else {
            return res.status(500).json({ error: 'Error interno del servidor.' });
        }
    }
};
