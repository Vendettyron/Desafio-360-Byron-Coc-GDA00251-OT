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

        IF @estadoPedido <> 4 --  4 es "En proceso"
        BEGIN
            ROLLBACK TRANSACTION;
            THROW 50001, 'Solo se pueden aprobar pedidos en estado "En proceso".', 1;
        END

        -- 2. Actualizar el estado del pedido a "Completado" (5)
        UPDATE Pedidos
        SET fk_estado = 5 -- 5 es "Completado"
        WHERE pk_id_pedido = @pk_id_pedido;

        -- 3. Registrar la operación en la tabla Log
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
