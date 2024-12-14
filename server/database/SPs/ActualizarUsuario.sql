USE MiTienditaOnlineDB;
GO

CREATE PROCEDURE ActualizarUsuario
    @id_usuario INT,
    @nombre NVARCHAR(100),
    @apellido NVARCHAR(100),
    @direccion NVARCHAR(100),
    @correo NVARCHAR(100),
    @telefono NVARCHAR(8),
    @password NVARCHAR(255),
    @fk_rol INT,
    @fk_estado INT,
	@fk_id_usuario INT = NULL -- Usuario que realiza la operación
AS
BEGIN
    BEGIN TRANSACTION;
    BEGIN TRY
        -- Actualizar los datos del usuario
        UPDATE Usuarios
        SET nombre = @nombre,
            apellido = @apellido,
            direccion = @direccion,
            correo = @correo,
            telefono = @telefono,
            password = @password,
            fk_rol = @fk_rol,
            fk_estado = @fk_estado
        WHERE pk_id_usuario = @id_usuario;

        -- Registrar en Log
        INSERT INTO Log (fechaHora, fk_id_usuario, entidadAfectada, operacion, detalles, resultado)
        VALUES (
            GETDATE(),
            @fk_id_usuario,
            'Usuarios',
            'UPDATE',
            CONCAT('Usuario actualizado: ID=', @id_usuario, ', Nombre=', @nombre, ', Correo=', @correo),
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