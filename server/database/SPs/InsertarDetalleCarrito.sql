USE MiTienditaOnlineDB;
GO

CREATE PROCEDURE InsertarDetalleCarrito
    @fk_id_carrito INT,
    @fk_id_producto INT,
    @cantidad INT,
    @fk_id_usuario_operacion INT = NULL -- Opcional, para el log
AS
BEGIN
    BEGIN TRANSACTION;

    BEGIN TRY
        DECLARE @estadoCarrito INT;
        DECLARE @precio_unitario DECIMAL(10,2);
        DECLARE @subtotal DECIMAL(10,2);
        DECLARE @existe INT;

        -- 1. Verificar que el carrito exista y esté en estado Pendiente (3)
        SELECT @estadoCarrito = fk_estado 
        FROM Carrito 
        WHERE pk_id_carrito = @fk_id_carrito;

        IF @estadoCarrito IS NULL
        BEGIN
            ROLLBACK TRANSACTION;
            THROW 50000, 'El carrito no existe.', 1;
        END

        IF @estadoCarrito <> 3
        BEGIN
            ROLLBACK TRANSACTION;
            THROW 50001, 'No se pueden agregar detalles a un carrito que no esté pendiente.', 1;
        END

        -- 2. Verificar si el producto ya existe en el carrito
        SELECT @existe = COUNT(*)
        FROM Detalle_Carrito
        WHERE fk_id_carrito = @fk_id_carrito
          AND fk_id_producto = @fk_id_producto;

        IF @existe > 0
        BEGIN
            ROLLBACK TRANSACTION;
            THROW 50002, 'Error: Utilice actualizarDetalleCarrito.', 1;
        END

        -- 3. Obtener el precio unitario del producto desde la tabla Productos
        SELECT @precio_unitario = precio
        FROM Productos
        WHERE pk_id_producto = @fk_id_producto
          AND fk_estado = 1; -- Asegurarse de que el producto esté activo

        IF @precio_unitario IS NULL
        BEGIN
            ROLLBACK TRANSACTION;
            THROW 50003, 'El producto especificado no existe o no está activo.', 1;
        END

        -- 4. Calcular el subtotal
        SET @subtotal = @cantidad * @precio_unitario;

        -- 5. Insertar el detalle en Detalle_Carrito
        INSERT INTO Detalle_Carrito (fk_id_carrito, fk_id_producto, precio_unitario, cantidad, subtotal)
        VALUES (@fk_id_carrito, @fk_id_producto, @precio_unitario, @cantidad, @subtotal);

        -- 6. Actualizar el total del carrito sumando todos los subtotales
        UPDATE Carrito
        SET total = (SELECT SUM(subtotal) FROM Detalle_Carrito WHERE fk_id_carrito = @fk_id_carrito)
        WHERE pk_id_carrito = @fk_id_carrito;

        -- 7. Registrar en el log
        INSERT INTO Log (
            fechaHora, 
            fk_id_usuario, 
            entidadAfectada, 
            operacion, 
            detalles, 
            resultado
        )
        VALUES (
            GETDATE(),
            @fk_id_usuario_operacion,
            'Detalle_Carrito',
            'INSERT',
            CONCAT(
                'Detalle insertado en Carrito ID: ', @fk_id_carrito, 
                ', Producto ID: ', @fk_id_producto, 
                ', Cantidad: ', @cantidad, 
                ', Precio Unitario: ', @precio_unitario,
                ', Subtotal: ', @subtotal
            ),
            'Éxito'
        );

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        -- Registrar el error en el log
        INSERT INTO Log (
            fechaHora, 
            fk_id_usuario, 
            entidadAfectada, 
            operacion, 
            detalles, 
            resultado
        )
        VALUES (
            GETDATE(),
            @fk_id_usuario_operacion,
            'Detalle_Carrito',
            'INSERT',
            ERROR_MESSAGE(),
            'Error'
        );

        THROW;
    END CATCH;
END;
GO
