USE MiTienditaOnlineDB;
GO
CREATE PROCEDURE ConfirmarCarrito
    @fk_id_carrito INT,
    @fk_id_usuario_operacion INT = NULL -- Usuario que realiza la confirmación, opcional
AS
BEGIN
    BEGIN TRANSACTION;

    BEGIN TRY
        DECLARE @estadoCarrito INT;
        DECLARE @fk_cliente INT;
        DECLARE @total DECIMAL(10,2);
        DECLARE @pk_id_pedido INT;

        -- Verificar que el carrito exista y esté pendiente (3)
        SELECT @estadoCarrito = fk_estado,
               @fk_cliente = fk_id_usuario,
               @total = total
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
            THROW 50001, 'El carrito debe estar en estado Pendiente para poder confirmarse.', 1;
        END

        -- Crear el pedido con estado "En proceso" (4)
        INSERT INTO Pedidos (fk_cliente, fk_estado, total)
        VALUES (@fk_cliente, 4, @total);

        SET @pk_id_pedido = SCOPE_IDENTITY();

        -- Copiar el detalle del carrito a detalle_pedido
        INSERT INTO Detalle_Pedido (fk_id_pedido, fk_id_producto, precio_unitario, cantidad, subtotal)
        SELECT @pk_id_pedido, fk_id_producto, precio_unitario, cantidad, subtotal
        FROM Detalle_Carrito
        WHERE fk_id_carrito = @fk_id_carrito;

        -- Actualizar el estado del carrito a Inactivo (2)
        UPDATE Carrito
        SET fk_estado = 2
        WHERE pk_id_carrito = @fk_id_carrito;

        -- Registrar en el log la confirmación del carrito
        INSERT INTO Log (fechaHora, fk_id_usuario, entidadAfectada, operacion, detalles, resultado)
        VALUES (
            GETDATE(),
            @fk_id_usuario_operacion,
            'Carrito',
            'UPDATE',
            CONCAT('Carrito confirmado y convertido a pedido. Carrito ID: ', @fk_id_carrito, 
                   ', Pedido ID: ', @pk_id_pedido, 
                   ', Cliente ID: ', @fk_cliente,
                   ', Total: ', @total),
            'Éxito'
        );

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        -- Registrar el error en el log
        INSERT INTO Log (fechaHora, fk_id_usuario, entidadAfectada, operacion, detalles, resultado)
        VALUES (
            GETDATE(),
            @fk_id_usuario_operacion,
            'Carrito',
            'UPDATE',
            ERROR_MESSAGE(),
            'Error'
        );
        
        THROW; -- Re-lanzar el error original
    END CATCH;
END;
