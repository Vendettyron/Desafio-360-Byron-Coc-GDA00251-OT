USE MiTienditaOnlineDB;
GO

CREATE PROCEDURE InsertarDetallePedido
    @fk_id_pedido INT,
    @fk_id_producto INT,
    @cantidad INT,
    @fk_id_usuario_operacion INT = NULL -- Opcional, para el log
AS
BEGIN
    BEGIN TRANSACTION;

    BEGIN TRY
        DECLARE @estadoPedido INT;
        DECLARE @precio DECIMAL(10,2);
        DECLARE @subtotal DECIMAL(10,2);
        DECLARE @existeDetalle INT;

        -- 1. Verificar que el pedido existe y está en estado "4" (pendiente)
        SELECT 
            @estadoPedido = fk_estado
        FROM 
            Pedidos
        WHERE 
            pk_id_pedido = @fk_id_pedido;

        IF @estadoPedido IS NULL
        BEGIN
            ROLLBACK TRANSACTION;
            THROW 50000, 'El pedido especificado no existe.', 1;
        END

        IF @estadoPedido <> 4 -- 4 es "pendiente"
        BEGIN
            ROLLBACK TRANSACTION;
            THROW 50001, 'Solo se pueden agregar detalles a pedidos en estado "pendiente".', 1;
        END

        -- 2. Verificar que el producto existe y está activo 
        SELECT 
            @precio = precio
        FROM 
            Productos
        WHERE 
            pk_id_producto = @fk_id_producto
            AND fk_estado = 1; 

        IF @precio IS NULL
        BEGIN
            ROLLBACK TRANSACTION;
            THROW 50002, 'El producto especificado no existe o no está activo.', 1;
        END

        -- 3. Validar que la cantidad es mayor a cero
        IF @cantidad <= 0
        BEGIN
            ROLLBACK TRANSACTION;
            THROW 50003, 'La cantidad debe ser mayor a cero.', 1;
        END

        -- 4. Verificar si el producto ya existe en el detalle del pedido
        SELECT 
            @existeDetalle = COUNT(*)
        FROM 
            Detalle_Pedido
        WHERE 
            fk_id_pedido = @fk_id_pedido
            AND fk_id_producto = @fk_id_producto;

        IF @existeDetalle > 0
        BEGIN
            ROLLBACK TRANSACTION;
            THROW 50004, 'El producto ya existe en el pedido. Use actualizar en su lugar.', 1;
        END

        -- 5. Calcular el subtotal
        SET @subtotal = @cantidad * @precio;

        -- 6. Insertar el detalle en Detalle_Pedido
        INSERT INTO Detalle_Pedido (fk_id_pedido, fk_id_producto, precio_unitario, cantidad, subtotal)
        VALUES (@fk_id_pedido, @fk_id_producto, @precio, @cantidad, @subtotal);

        -- 7. Recalcular y actualizar el total del pedido
        UPDATE Pedidos
        SET total = (SELECT SUM(subtotal) FROM Detalle_Pedido WHERE fk_id_pedido = @fk_id_pedido)
        WHERE pk_id_pedido = @fk_id_pedido;

        -- 8. Registrar la operación en el Log
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
            'Detalle_Pedido', 
            'INSERT', 
            CONCAT('Detalle insertado en Pedido ID: ', @fk_id_pedido, 
                   ', Producto ID: ', @fk_id_producto, 
                   ', Cantidad: ', @cantidad, 
                   ', Subtotal: ', @subtotal), 
            'Éxito'
        );

        -- Confirmar la transacción
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        -- Revertir la transacción en caso de error
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        -- Registrar el error en el Log
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
            'Detalle_Pedido', 
            'INSERT', 
            ERROR_MESSAGE(), 
            'Error'
        );

        -- Re-lanzar el error para manejo externo
        THROW;
    END CATCH;
END;
