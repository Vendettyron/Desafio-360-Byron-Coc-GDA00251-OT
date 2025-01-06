USE MiTienditaOnlineDB;
GO

CREATE PROCEDURE ActualizarUsuarioElMismo
    @pk_id_usuario INT,           
    @nombre VARCHAR(100),          
    @apellido VARCHAR(100),       
    @direccion VARCHAR(100),      
    @correo VARCHAR(100),         
    @telefono VARCHAR(8)           
AS
BEGIN
    SET NOCOUNT ON; 

    BEGIN TRY
        BEGIN TRANSACTION;

        -- 1. Obtener el correo actual del usuario
        DECLARE @correo_actual VARCHAR(100);
        SELECT @correo_actual = correo 
        FROM Usuarios 
        WHERE pk_id_usuario = @pk_id_usuario;

        -- 2. Verificar si el nuevo correo es diferente al actual
        IF (@correo <> @correo_actual)
        BEGIN
            -- 3. Verificar si el nuevo correo ya existe para otro usuario
            IF EXISTS (
                SELECT 1 
                FROM Usuarios
                WHERE correo = @correo
                  AND pk_id_usuario <> @pk_id_usuario
            )
            BEGIN
                -- Si el correo ya existe para otro usuario, genera un error
                RAISERROR('El correo proporcionado ya existe para otro usuario.', 16, 1);
                ROLLBACK TRANSACTION; -- Revierte la transacción
                RETURN; -- Sale del procedimiento
            END
        END

        -- 4. Actualizar la información del usuario
        UPDATE Usuarios
        SET
            nombre = @nombre,
            apellido = @apellido,
            direccion = @direccion,
            correo = @correo,
            telefono = @telefono
        WHERE pk_id_usuario = @pk_id_usuario;

        -- 5. Registrar la operación en el log
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
            @pk_id_usuario, 
            'Usuarios', 
            'UPDATE', 
            CONCAT('Información actualizada para Usuario ID: ', @pk_id_usuario, 
                   ', Nombre: ', @nombre, 
                   ', Apellido: ', @apellido, 
                   ', Dirección: ', @direccion, 
                   ', Correo: ', @correo, 
                   ', Teléfono: ', @telefono), 
            'Éxito'
        );

        -- 6. Confirmar la transacción
        COMMIT TRANSACTION;

        -- 7. Devolver un mensaje de éxito
        SELECT 'Usuario actualizado exitosamente.' AS Mensaje;

    END TRY
    BEGIN CATCH
        -- Manejo de errores

        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION; -- Revierte la transacción si está abierta

        -- Captura la información del error
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();

        -- Registrar el error en la tabla Log para la entidad 'Usuarios'
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
            @pk_id_usuario, 
            'Usuarios', 
            'UPDATE', 
            @ErrorMessage, 
            'Error'
        );

        -- Re-lanzar el error original para manejo externo
        RAISERROR (@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END
GO

