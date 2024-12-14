EXEC InsertarProveedor
    @nombre = 'Microsoft',
    @telefono = '34567890',
    @correo = 'contact@microsoft.com',
    @fk_estado = 1, -- Activo
    @fk_id_usuario = 5; -- Usuario que realiza la operación (Byron Coc)

EXEC InsertarProducto
    @fk_categoria = 1, -- Audio
    @fk_estado = 1, -- Activo
    @fk_proveedor = 2, -- Sony
    @nombre = 'Sony SRS-XB43',
    @descripcion = 'Bocina portátil con luces y alta potencia de sonido',
    @precio = 4000.00,
    @stock = 20,
    @fk_id_usuario = 5; -- Usuario que realiza la operación (Byron Coc)

	EXEC InsertarDetalleCarrito
    @fk_id_carrito = 11, -- Carrito existente
    @fk_id_producto = 3, -- Producto existente (Procesador AMD Ryzen 9 7950X)
    @cantidad = 1,
    @fk_id_usuario_operacion = 5; -- Usuario que realiza la operación (Byron Coc)

	EXEC InsertarDetallePedido
    @fk_id_pedido = 1, -- Pedido existente
    @fk_id_producto = 3, -- Producto existente (Teclado Logitech G915)
    @cantidad = 1,
    @fk_id_usuario_operacion = 5; -- Usuario que realiza la operación (Byron Coc)


	EXEC InsertarCategoria
    @nombre = 'Accesorios',
    @descripcion = 'Accesorios para computadoras y consolas',
    @fk_estado = 1, -- Activo
    @fk_id_usuario = 5; -- Usuario que realiza la operación (Byron Coc)

	EXEC InactivarUsuario
    @id_usuario = 2, -- ID del usuario a inactivar (Javier Estrada)
    @fk_id_usuario = 5; -- Usuario que realiza la operación (Byron Coc)

	EXEC InactivarProveedor
    @id_proveedor = 100, -- ID del proveedor a inactivar (AMD)
    @fk_id_usuario = 5; -- Usuario que realiza la operación (Byron Coc)

	EXEC InactivarProducto
    @id_producto = 5, -- ID del producto a inactivar (AMD Ryzen 9 7950X)
    @fk_id_usuario = 5; -- Usuario que realiza la operación (Byron Coc)

	EXEC InactivarCategoria
    @id_categoria = 3, -- ID de la categoría a inactivar (Teclado)
    @fk_id_usuario = 5; -- Usuario que realiza la operación (Byron Coc)

	EXEC ActivarUsuario
    @pk_id_usuario = 2, -- ID del usuario a activar (Javier Estrada)
    @id_usuario_accion = 5; -- Usuario que realiza la operación (Byron Coc)

	EXEC ActivarProveedor
    @pk_id_proveedor = 3, -- ID del proveedor a activar (AMD)
    @id_usuario_accion = 5; -- Usuario que realiza la operación (Byron Coc)

	EXEC ActivarProducto
    @pk_id_producto = 5, -- ID del producto a activar (AMD Ryzen 9 7950X)
    @id_usuario_accion = 5; -- Usuario que realiza la operación (Byron Coc)

	EXEC ActivarCategoria
    @pk_id_categoria = 3, -- ID de la categoría a activar (Teclado)
    @id_usuario_accion = 5; -- Usuario que realiza la operación (Byron Coc)

	EXEC ActualizarUsuario
    @id_usuario = 1, -- ID del usuario a actualizar (Jose Perez)
    @nombre = 'Jose',
    @apellido = 'Perez',
    @direccion = 'Calle Principal 123, Apt 5',
    @correo = 'jose.perez@example.com',
    @telefono = '98765432',
    @password = 'newhashedpassword123',
    @fk_rol = 2, -- Usuario
    @fk_estado = 1, -- Activo
    @fk_id_usuario = 5; -- Usuario que realiza la operación (Byron Coc)

	EXEC ActualizarProveedor
    @pk_id_proveedor = 2, -- ID del proveedor a actualizar (Sony)
    @nombre = 'Sony Corporation',
    @telefono = '11223344',
    @correo = 'support@sony.com',
    @fk_estado = 1, -- Activo
    @fk_id_usuario = 5; -- Usuario que realiza la operación (Byron Coc)

	EXEC ActualizarProducto
    @id_producto = 1, -- ID del producto a actualizar (Audífonos Sony WH-1000XM5) 
	@fk_categoria = 1, -- Audio
	@fk_proveedor = 2, -- Sony
	@nombre = 'Audífonos Sony WH-1000XM5', ----
    @descripcion = 'Audífonos inalámbricos con cancelación de ruido mejorada', ----
	@precio = 3100.00, ----
    @stock = 45, ----
    @fk_estado = 1, -- Activo ---
	@fk_id_usuario = 5; -- Usuario que realiza la operación (Byron Coc) -----

	EXEC ActualizarEstado
    @pk_id_estado = 8, -- ID del estado a actualizar (Descontinuado)
    @nombre = 'Producto Descontinuado',
    @fk_id_usuario_operacion = 5; -- Usuario que realiza la operación (Byron Coc)

	EXEC ActualizarDetallePedido
    @fk_id_pedido = 1, -- Pedido existente
    @fk_id_producto = 1, -- Producto existente en el pedido (Audífonos Sony WH-1000XM5)
    @nueva_cantidad = 1,
    @fk_id_usuario_operacion = 5; -- Usuario que realiza la operación (Byron Coc)

	EXEC ActualizarDetalleCarrito
    @fk_id_carrito = 5, -- Carrito existente
    @fk_id_producto = 4, -- Producto existente en el carrito (Audífonos Sony WH-1000XM5)
    @nueva_cantidad = 1,
    @fk_id_usuario_operacion = 5; -- Usuario que realiza la operación (Byron Coc)

	EXEC ActualizarCategoria
    @id_categoria = 2, -- ID de la categoría a actualizar (Mouse)
    @nombre = 'Mouse',
    @descripcion = 'Mouse de oficina, gamer, ergonómicos, etc.',
    @fk_estado = 1, -- Activo
    @fk_id_usuario = 5; -- Usuario que realiza la operación (Byron Coc)

	EXEC CrearCarrito
    @fk_id_usuario = 6, -- Usuario que crea el carrito (Jose Perez)
    @fk_id_usuario_operacion = 5;

	EXEC EliminarDetalleCarrito
    @fk_id_carrito = 4, -- Carrito existente
    @fk_id_producto = 1, -- Producto existente en el carrito (Procesador AMD Ryzen 9 7950X)
    @fk_id_usuario_operacion = 5; -- Usuario que realiza la operación (Byron Coc)

	EXEC EliminarDetallePedido
    @fk_id_pedido = 10, -- Pedido existente
    @fk_id_producto = 5, -- Producto existente en el pedido (Audífonos Sony WH-1000XM5)
    @fk_id_usuario_operacion = 5; -- Usuario que realiza la operación (Byron Coc)

	EXEC ConfirmarCarrito
    @fk_id_carrito = 11, -- Carrito existente
    @fk_id_usuario_operacion = 5; -- Usuario que realiza la operación (Byron Coc)

	EXEC AprobarPedido
    @pk_id_pedido = 5, -- Pedido existente
    @fk_id_usuario_operacion = 5; -- Usuario que realiza la operación (Byron Coc)

	EXEC CancelarPedidoCliente
    @pk_id_pedido = 1, -- Pedido existente
    @fk_id_usuario_operacion = 5; -- Usuario que realiza la operación (Byron Coc)

	EXEC CancelarPedidoAdministrador
    @pk_id_pedido = 3, -- Pedido existente
    @fk_id_usuario_operacion = 5; -- Usuario que realiza la operación (Byron Coc)