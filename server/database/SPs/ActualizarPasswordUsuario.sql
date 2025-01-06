use MiTienditaOnlineDB
GO

CREATE PROCEDURE ActualizarPassword
    @pk_id_usuario INT,           -- ID del usuario a actualizar
    @password VARCHAR(60)   -- Nuevo password del usuario
AS
BEGIN
    SET NOCOUNT ON; 

    BEGIN TRY
        BEGIN TRANSACTION; 

        -- 1. Verificar que el usuario exista
        IF NOT EXISTS (
            SELECT 1
            FROM Usuarios
            WHERE pk_id_usuario = @pk_id_usuario
        )
        BEGIN
            RAISERROR('El usuario especificado no existe.', 16, 1);
            ROLLBACK TRANSACTION; 
            RETURN; 
        END

        -- 2. Actualizar el password del usuario
        UPDATE Usuarios
        SET password = @password
        WHERE pk_id_usuario = @pk_id_usuario;

        -- 3. Registrar la operación en el log
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
            CONCAT('Password actualizado para Usuario ID: ', @pk_id_usuario), 
            'Éxito'
        );

        -- 4. Confirmar la transacción
        COMMIT TRANSACTION;

        -- 5. Devolver un mensaje de éxito
        SELECT 'Password actualizado exitosamente.' AS Mensaje;

    END TRY
    BEGIN CATCH
        -- Manejo de errores

        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION; -- Revierte la transacción si está abierta

        -- Captura la información del error
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();

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
