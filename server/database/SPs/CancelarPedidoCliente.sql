USE MiTienditaOnlineDB;
GO

CREATE PROCEDURE CancelarPedidoCliente
    @pk_id_pedido INT,
    @fk_id_usuario_operacion INT -- ID 
AS
BEGIN
    -- Iniciar la transacci�n
    BEGIN TRANSACTION;

    BEGIN TRY
        DECLARE @estadoPedido INT;
        DECLARE @fk_cliente INT;
        DECLARE @total DECIMAL(10,2);

        -- 1. Verificar que el pedido existe y est� en estado "En proceso" (4)
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

        IF @estadoPedido <> 4 -- 4 es "En proceso"
        BEGIN
            ROLLBACK TRANSACTION;
            THROW 50001, 'Solo se pueden cancelar pedidos en estado "En proceso".', 1;
        END

        -- 2. Actualizar el estado del pedido a "Cancelado" (6)
        UPDATE Pedidos
        SET fk_estado = 7 --  7 es "Cancelado POR CLIENTE"
        WHERE pk_id_pedido = @pk_id_pedido;

        -- 3. Registrar la operaci�n en la tabla Log
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
            CONCAT('Cancelado POR CLIENTE ID: ', @pk_id_pedido, 
                   ', Cliente ID: ', @fk_cliente, 
                   ', Total: ', @total), 
            '�xito'
        );

        -- 4. Confirmar la transacci�n
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        -- Si hay una transacci�n abierta, revertirla
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
