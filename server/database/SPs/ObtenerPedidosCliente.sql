USE MiTienditaOnlineDB;
GO

CREATE PROCEDURE ObtenerPedidosCliente
    @fk_cliente INT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        -- Iniciar la transacción
        BEGIN TRANSACTION;

        DECLARE @total_pedidos INT;

        -- 1. Verificar que el cliente existe
        IF NOT EXISTS (SELECT 1 FROM Usuarios WHERE pk_id_usuario = @fk_cliente)
        BEGIN
            ROLLBACK TRANSACTION;
            THROW 50000, 'El cliente especificado no existe.', 1;
        END

        -- 2. Verificar si el cliente tiene pedidos en estado "4" (pendiente)
        SELECT 
            @total_pedidos = COUNT(*)
        FROM 
            Pedidos
        WHERE 
            fk_cliente = @fk_cliente
            AND fk_estado = 4; -- Estado "4" es "Pendiente"

        IF @total_pedidos = 0
        BEGIN
            ROLLBACK TRANSACTION;
            THROW 50001, 'No existen pedidos en estado "Pendiente" para este cliente.', 1;
        END

        -- 3. Obtener los detalles de los pedidos en estado "4"
        SELECT 
            p.fk_estado AS estado,
            p.total,
            p.fecha_pedido,
            p.pk_id_pedido AS id_pedido
        FROM 
            Pedidos p
        WHERE 
            p.fk_cliente = @fk_cliente
            AND p.fk_estado = 4; -- Estado "4" es "Pendiente"

        -- 4. Registrar la operación en la tabla Log
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
            @fk_cliente, 
            'Pedidos', 
            'SELECT', 
            CONCAT('Se obtuvieron ', @total_pedidos, ' pedidos pendientes para el Cliente ID: ', @fk_cliente), 
            'Éxito'
        );

        -- 5. Confirmar la transacción
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        -- Revertir la transacción en caso de error
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
            @fk_cliente, 
            'Pedidos', 
            'SELECT', 
            @ErrorMessage, 
            'Error'
        );

        -- Re-lanzar el error para manejo externo
        THROW;
    END CATCH;
END;
GO
