USE MiTienditaOnlineDB;
GO

CREATE PROCEDURE InactivarUsuario
    @id_usuario INT,
    @fk_id_usuario INT -- Usuario que realiza la operación
AS
BEGIN
    BEGIN TRANSACTION;
    BEGIN TRY
        -- Actualizar el estado del usuario a "Inactivo"
        UPDATE Usuarios
        SET fk_estado = 2 -- "Inactivo"
        WHERE pk_id_usuario = @id_usuario;

        -- Registrar en Log
        INSERT INTO Log (fechaHora, fk_id_usuario, entidadAfectada, operacion, detalles, resultado)
        VALUES (
            GETDATE(),
            @fk_id_usuario,
            'Usuarios',
            'UPDATE',
            CONCAT('Usuario inactivado: ID=', @id_usuario),
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
            'Usuarios',
            'UPDATE',
            ERROR_MESSAGE(),
            'Error'
        );
        THROW;
    END CATCH;
END;