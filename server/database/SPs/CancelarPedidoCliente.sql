USE MiTienditaOnlineDB;
GO

CREATE PROCEDURE CancelarPedidoCliente
    @fk_id_cliente INT,        -- ID del cliente que desea cancelar el pedido
    @fk_id_pedido INT          -- ID del pedido que se desea cancelar
AS
BEGIN
    SET NOCOUNT ON;

    -- Iniciar la transacci�n
    BEGIN TRANSACTION;

    BEGIN TRY
        DECLARE @estadoPedido INT;
        DECLARE @total DECIMAL(10,2);

        -- 1. Verificar que el cliente exista
        IF NOT EXISTS (SELECT 1 FROM Usuarios WHERE pk_id_usuario = @fk_id_cliente)
        BEGIN
            ROLLBACK TRANSACTION;
            THROW 50000, 'El cliente especificado no existe.', 1;
        END

        -- 2. Verificar que el pedido exista, pertenezca al cliente y est� en estado "En proceso" (4)
        SELECT 
            @estadoPedido = fk_estado,
            @total = total
        FROM 
            Pedidos
        WHERE 
            pk_id_pedido = @fk_id_pedido
            AND fk_cliente = @fk_id_cliente
            AND fk_estado = 4; -- Estado "En proceso"

        IF @estadoPedido IS NULL
        BEGIN
            ROLLBACK TRANSACTION;
            THROW 50001, 'No existe un pedido en estado "En proceso" para este usuario con el ID proporcionado.', 1;
        END

        -- 3. Actualizar el estado del pedido a "Cancelado por Cliente" (7)
        UPDATE Pedidos
        SET fk_estado = 7 -- 7 es "Cancelado por Cliente"
        WHERE pk_id_pedido = @fk_id_pedido;

        -- 4. Registrar la operaci�n en la tabla Log
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
            @fk_id_cliente, 
            'Pedidos', 
            'UPDATE', 
            CONCAT('Pedido cancelado por Cliente ID: ', @fk_id_pedido, 
                   ', Cliente ID: ', @fk_id_cliente, 
                   ', Total: ', @total), 
            '�xito'
        );

        -- 5. Confirmar la transacci�n
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        -- Revertir la transacci�n en caso de error
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        -- Capturar detalles del error
        DECLARE @ErrorMessage NVARCHAR(4000);
        DECLARE @ErrorSeverity INT;
        DECLARE @ErrorState INT;

        SELECT 
            @ErrorMessage = ERROR_MESSAGE(),
            @ErrorSeverity = ERROR_SEVERITY(),
            @ErrorState = ERROR_STATE();

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
            @fk_id_cliente, 
            'Pedidos', 
            'UPDATE', 
            @ErrorMessage, 
            'Error'
        );

        -- Re-lanzar el error para manejo externo
        THROW;
    END CATCH;
END;
GO
