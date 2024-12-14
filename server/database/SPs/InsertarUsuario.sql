USE MiTienditaOnlineDB;
GO

CREATE PROCEDURE InsertarUsuario
    @nombre VARCHAR(100),
    @apellido VARCHAR(100),
    @direccion VARCHAR(100),
    @correo VARCHAR(100),
    @telefono VARCHAR(8),
    @password VARCHAR(255),
    @fk_rol INT,
    @fk_estado INT,
    @fk_id_usuario INT = NULL  -- parámetro opcional
AS
BEGIN
    BEGIN TRANSACTION;

    BEGIN TRY
        -- Inserción del usuario
        INSERT INTO Usuarios (nombre, apellido, direccion, correo, telefono, password, fk_rol, fk_estado)
        VALUES (@nombre, @apellido, @direccion, @correo, @telefono, @password, @fk_rol, @fk_estado);

        -- Registro en la tabla de log, usando @fk_id_usuario en lugar de NULL
        INSERT INTO Log (fechaHora, fk_id_usuario, entidadAfectada, operacion, detalles, resultado)
        VALUES (GETDATE(), @fk_id_usuario, 'Usuarios', 'INSERT', 
                CONCAT('Usuario insertado: ', @nombre, ' ', @apellido, ', correo: ', @correo), 'Éxito');

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;

        -- Registrar el error en el log
        INSERT INTO Log (fechaHora, fk_id_usuario, entidadAfectada, operacion, detalles, resultado)
        VALUES (GETDATE(), @fk_id_usuario, 'Usuarios', 'INSERT', ERROR_MESSAGE(), 'Error');
        
        THROW;
    END CATCH;
END;