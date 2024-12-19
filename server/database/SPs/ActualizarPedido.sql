USE MiTienditaOnlineDB;
GO

CREATE PROCEDURE ActualizarEstadoPedido
    @id_pedido INT,
    @fk_estado INT,
    @fk_id_usuario INT -- Usuario que realiza la operaci�n
AS
BEGIN
    BEGIN TRANSACTION;
    BEGIN TRY
        -- Actualizar el estado del pedido
        UPDATE Pedidos
        SET fk_estado = @fk_estado
        WHERE pk_id_pedido = @id_pedido;

        -- Registrar en Log
        INSERT INTO Log (fechaHora, fk_id_usuario, entidadAfectada, operacion, detalles, resultado)
        VALUES (
            GETDATE(),
            @fk_id_usuario,
            'Pedidos',
            'UPDATE',
            CONCAT('Estado de pedido actualizado: ID=', @id_pedido, ', Nuevo Estado=', @fk_estado),
            '�xito'
        );

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        INSERT INTO Log (fechaHora, fk_id_usuario, entidadAfectada, operacion, detalles, resultado)
        VALUES (
            GETDATE(),
            @fk_id_usuario,
            'Pedidos',
            'UPDATE',
            ERROR_MESSAGE(),
            'Error'
        );
        THROW;
    END CATCH;
END;