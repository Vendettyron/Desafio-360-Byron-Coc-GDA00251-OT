USE MiTienditaOnlineDB;
GO

CREATE PROCEDURE InactivarProveedor
    @id_proveedor INT,
    @fk_id_usuario INT -- Usuario que realiza la operación
AS
BEGIN
    BEGIN TRANSACTION;
    BEGIN TRY
        -- Actualizar el estado del proveedor a "Inactivo"
        UPDATE Proveedor
        SET fk_estado = 2 -- Suponiendo que 2 es el estado "Inactivo"
        WHERE pk_id_proveedor = @id_proveedor;

        -- Registrar en Log
        INSERT INTO Log (fechaHora, fk_id_usuario, entidadAfectada, operacion, detalles, resultado)
        VALUES (
            GETDATE(),
            @fk_id_usuario,
            'Proveedor',
            'UPDATE',
            CONCAT('Proveedor inactivado: ID=', @id_proveedor),
            'Éxito'
        );

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        INSERT INTO Log (fechaHora, fk_id_usuario, entidadAfectada, operacion, detalles, resultado)
        VALUES (
            GETDATE(),
            @fk_id_usuario,
            'Proveedor',
            'UPDATE',
            ERROR_MESSAGE(),
            'Error'
        );
        THROW;
    END CATCH;
END;