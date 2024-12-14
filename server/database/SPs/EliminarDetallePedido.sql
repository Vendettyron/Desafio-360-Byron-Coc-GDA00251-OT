USE MiTienditaOnlineDB;
GO
CREATE PROCEDURE EliminarDetallePedido
    @fk_id_pedido INT,
    @fk_id_producto INT,
    @fk_id_usuario_operacion INT = NULL -- Opcional, para el log
AS
BEGIN
    BEGIN TRANSACTION;

    BEGIN TRY
        DECLARE @estadoPedido INT;
        DECLARE @fk_cliente INT;
        DECLARE @total_antiguo DECIMAL(10,2);
        DECLARE @total_nuevo DECIMAL(10,2);
        DECLARE @cantidad_eliminada INT;
        DECLARE @precio_unitario DECIMAL(10,2);
        DECLARE @subtotal_eliminado DECIMAL(10,2);

        -- 1. Verificar que el pedido existe y está en estado "4" (pendiente)
        SELECT 
            @estadoPedido = fk_estado,
            @fk_cliente = fk_cliente,
            @total_antiguo = total
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
            THROW 50001, 'Solo se pueden eliminar detalles de pedidos en estado "pendiente".', 1;
        END

        -- 2. Verificar que el detalle del pedido (producto) existe
        SELECT 
            @cantidad_eliminada = cantidad,
            @precio_unitario = precio_unitario,
            @subtotal_eliminado = subtotal
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

        -- 3. Eliminar el detalle del pedido
        DELETE FROM Detalle_Pedido
        WHERE 
            fk_id_pedido = @fk_id_pedido
            AND fk_id_producto = @fk_id_producto;

        -- 4. Recalcular y actualizar el total del pedido
        SELECT @total_nuevo = SUM(subtotal)
        FROM Detalle_Pedido
        WHERE fk_id_pedido = @fk_id_pedido;

        UPDATE Pedidos
        SET total = ISNULL(@total_nuevo, 0)
        WHERE pk_id_pedido = @fk_id_pedido;

        -- 5. Registrar la operación en el Log
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
            'DELETE', 
            CONCAT('Detalle eliminado de Pedido ID: ', @fk_id_pedido, 
                   ', Producto ID: ', @fk_id_producto, 
                   ', Cantidad eliminada: ', @cantidad_eliminada, 
                   ', Subtotal eliminado: ', @subtotal_eliminado), 
            'Éxito'
        );

        -- 6. Confirmar la transacción
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
            'DELETE', 
            ERROR_MESSAGE(), 
            'Error'
        );

        -- Re-lanzar el error para manejo externo
        THROW;
    END CATCH;
END;
