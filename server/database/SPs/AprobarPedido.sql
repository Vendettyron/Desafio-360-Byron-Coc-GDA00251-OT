USE MiTienditaOnlineDB;
GO

CREATE PROCEDURE AprobarPedido
    @pk_id_pedido INT,
    @fk_id_usuario_operacion INT -- ID del administrador que aprueba el pedido
AS
BEGIN
    -- Iniciar la transacción
    BEGIN TRANSACTION;

    BEGIN TRY
        DECLARE @estadoPedido INT;
        DECLARE @fk_cliente INT;
        DECLARE @total DECIMAL(10,2);

        -- 1. Verificar que el pedido existe y está en estado "En proceso" (4)
        SELECT 
            @estadoPedido = fk_estado,
            @fk_cliente = fk_cliente,
            @total = total
        FROM 
            Pedidos
        WHERE 
            pk_id_pedido = @pk_id_pedido;

        IF @estadoPedido IS NULL
        BEGIN
            ROLLBACK TRANSACTION;
            THROW 50000, 'El pedido especificado no existe.', 1;
        END

        IF @estadoPedido <> 4 -- Asumiendo que 4 es "En proceso"
        BEGIN
            ROLLBACK TRANSACTION;
            THROW 50001, 'Solo se pueden aprobar pedidos en estado "En proceso".', 1;
        END

        -- 2. Verificar que hay suficiente stock para cada producto en el pedido
        IF EXISTS (
            SELECT 1
            FROM Detalle_Pedido dp
            INNER JOIN Productos p ON dp.fk_id_producto = p.pk_id_producto
            WHERE dp.fk_id_pedido = @pk_id_pedido
              AND p.stock < dp.cantidad
        )
        BEGIN
            ROLLBACK TRANSACTION;
            THROW 50002, 'No hay suficiente stock para uno o más productos en este pedido.', 1;
        END

        -- 3. Actualizar el stock de los productos
        UPDATE p
        SET p.stock = p.stock - dp.cantidad
        FROM Productos p
        INNER JOIN Detalle_Pedido dp ON p.pk_id_producto = dp.fk_id_producto
        WHERE dp.fk_id_pedido = @pk_id_pedido;

        -- 4. Actualizar el estado del pedido a "Completado" (5)
        UPDATE Pedidos
        SET fk_estado = 5 -- 5 es "Completado"
        WHERE pk_id_pedido = @pk_id_pedido;

        -- 5. Registrar la operación en la tabla Log
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
            'Pedidos', 
            'UPDATE', 
            CONCAT('Pedido aprobado. ID: ', @pk_id_pedido, 
                   ', Cliente ID: ', @fk_cliente, 
                   ', Total: ', @total), 
            'Éxito'
        );

        -- Confirmar la transacción
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        -- Si hay una transacción abierta, revertirla
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        -- Registrar el error en la tabla Log
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
            'Pedidos', 
            'UPDATE', 
            ERROR_MESSAGE(), 
            'Error'
        );

        -- Re-lanzar el error original para manejo externo
        THROW;
    END CATCH;
END;
