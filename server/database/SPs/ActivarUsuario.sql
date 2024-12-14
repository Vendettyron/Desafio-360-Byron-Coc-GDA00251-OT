USE MiTienditaOnlineDB;
GO

CREATE PROCEDURE ActivarUsuario
    @pk_id_usuario INT,
    @id_usuario_accion INT
AS
BEGIN
    BEGIN TRY
        -- Actualizar estado del usuario a Activo
        UPDATE Usuarios
        SET fk_estado = 1
        WHERE pk_id_usuario = @pk_id_usuario;

        -- Registrar en el log
        INSERT INTO log (fechaHora, fk_id_usuario, entidadAfectada, operacion, detalles, resultado)
        VALUES (
            GETDATE(),
            @id_usuario_accion,
            'Usuarios',
            'ACTIVACIÓN',
            CONCAT('El usuario con ID ', @pk_id_usuario, ' fue activado.'),
            'Éxito'
        );
    END TRY
    BEGIN CATCH
        -- Manejo de errores y registro en el log
        INSERT INTO log (fechaHora, fk_id_usuario, entidadAfectada, operacion, detalles, resultado)
        VALUES (
            GETDATE(),
            @id_usuario_accion,
            'Usuarios',
            'ACTIVACIÓN',
            ERROR_MESSAGE(),
            'Error'
        );
    END CATCH
END;