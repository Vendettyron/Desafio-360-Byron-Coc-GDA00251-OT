USE MiTienditaOnlineDB;
GO

CREATE PROCEDURE InactivarUsuarioElMismo
    @id_usuario INT,
    @fk_id_usuario INT -- Usuario que realiza la operación (mismo usuario)
AS
BEGIN
    BEGIN TRANSACTION;
    BEGIN TRY
        -- Verificar que el usuario existe y está activo
        IF NOT EXISTS (
            SELECT 1 FROM Usuarios
            WHERE pk_id_usuario = @id_usuario AND fk_estado = 1
        )
        BEGIN
            RAISERROR ('El usuario no existe o ya está inactivo.', 16, 1);
        END

        -- Actualizar el estado del usuario a "Inactivo"
        UPDATE Usuarios
        SET fk_estado = 2 -- "Inactivo"
        WHERE pk_id_usuario = @id_usuario;

        -- Registrar en Log
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
        DECLARE @ErrorMessage NVARCHAR(4000);
        DECLARE @ErrorSeverity INT;
        DECLARE @ErrorState INT;

        SELECT 
            @ErrorMessage = ERROR_MESSAGE(),
            @ErrorSeverity = ERROR_SEVERITY(),
            @ErrorState = ERROR_STATE();

        -- Registrar el error en Log
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
            @fk_id_usuario,
            'Usuarios',
            'UPDATE',
            @ErrorMessage,
            'Error'
        );

        -- Re-lanzar el error
        RAISERROR (@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH;
END;
GO
