USE MiTienditaOnlineDB;
GO
CREATE PROCEDURE ActualizarDetallePedido
    @fk_id_pedido INT,
    @fk_id_producto INT,
    @nueva_cantidad INT,
    @fk_id_usuario_operacion INT = NULL -- Opcional, para el log
AS
BEGIN
    BEGIN TRANSACTION;

    BEGIN TRY
        DECLARE @estadoPedido INT;
        DECLARE @precio_unitario DECIMAL(10,2);
        DECLARE @subtotal_antiguo DECIMAL(10,2);
        DECLARE @subtotal_nuevo DECIMAL(10,2);
        DECLARE @fk_cliente INT;
        DECLARE @total_nuevo DECIMAL(10,2);

        -- 1. Verificar que el pedido existe y está en estado "4" (pendiente)
        SELECT 
            @estadoPedido = fk_estado,
            @fk_cliente = fk_cliente
        FROM 
            Pedidos
        WHERE 
            pk_id_pedido = @fk_id_pedido;

        IF @estadoPedido IS NULL
        BEGIN
            ROLLBACK TRANSACTION;
            THROW 50000, 'El pedido especificado no existe.', 1;
        END

        IF @estadoPedido <> 4 --  4 es "pendiente"
        BEGIN
            ROLLBACK TRANSACTION;
            THROW 50001, 'Solo se pueden actualizar detalles de pedidos en estado "pendiente".', 1;
        END

        -- 2. Verificar que el detalle del pedido (producto) existe
        SELECT 
            @precio_unitario = precio_unitario,
            @subtotal_antiguo = subtotal
        FROM 
            Detalle_Pedido
        WHERE 
            fk_id_pedido = @fk_id_pedido
            AND fk_id_producto = @fk_id_producto;

        IF @precio_unitario IS NULL
        BEGIN
            ROLLBACK TRANSACTION;
            THROW 50002, 'El producto especificado no existe en el pedido.', 1;
        END

        -- 3. Validar que la nueva cantidad sea al menos 1
        IF @nueva_cantidad < 1
        BEGIN
            ROLLBACK TRANSACTION;
            THROW 50003, 'La cantidad mínima debe ser al menos 1.', 1;
        END

        -- 4. Calcular el nuevo subtotal
        SET @subtotal_nuevo = @nueva_cantidad * @precio_unitario;

        -- 5. Actualizar el detalle del pedido
        UPDATE Detalle_Pedido
        SET 
            cantidad = @nueva_cantidad,
            subtotal = @subtotal_nuevo
        WHERE 
            fk_id_pedido = @fk_id_pedido
            AND fk_id_producto = @fk_id_producto;

        -- 6. Recalcular el total del pedido
        SELECT @total_nuevo = SUM(subtotal)
        FROM Detalle_Pedido
        WHERE fk_id_pedido = @fk_id_pedido;

        UPDATE Pedidos
        SET total = ISNULL(@total_nuevo, 0)
        WHERE pk_id_pedido = @fk_id_pedido;

        -- 7. Registrar la operación en el Log
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
            'UPDATE', 
            CONCAT('Detalle actualizado en Pedido ID: ', @fk_id_pedido, 
                   ', Producto ID: ', @fk_id_producto, 
                   ', Cantidad antigua: ', (SELECT cantidad FROM Detalle_Pedido WHERE fk_id_pedido = @fk_id_pedido AND fk_id_producto = @fk_id_producto), 
                   ', Nueva cantidad: ', @nueva_cantidad, 
                   ', Subtotal antiguo: ', @subtotal_antiguo, 
                   ', Subtotal nuevo: ', @subtotal_nuevo), 
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
            'UPDATE', 
            ERROR_MESSAGE(), 
            'Error'
        );

        -- Re-lanzar el error para manejo externo
        THROW;
    END CATCH;
END;
