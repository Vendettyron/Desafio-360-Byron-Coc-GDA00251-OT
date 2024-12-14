USE MiTienditaOnlineDB;
GO

CREATE PROCEDURE InsertarEstado
    @nombre VARCHAR(50),
    @fk_id_usuario_operacion INT = NULL -- Parámetro opcional para el log
AS
BEGIN
    BEGIN TRANSACTION;

    BEGIN TRY
        -- Inserción del nuevo estado
        INSERT INTO Estados (nombre)
        VALUES (@nombre);

        -- Obtener el ID del estado recién insertado
        DECLARE @pk_id_estado INT = SCOPE_IDENTITY();

        -- Registro en la tabla de log
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
            @fk_id_usuario_operacion, 
            'Estados', 
            'INSERT', 
            CONCAT('Estado insertado: ', @nombre, ', ID: ', @pk_id_estado), 
            'Éxito'
        );

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        -- Registro del error en el log
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
            @fk_id_usuario_operacion, 
            'Estados', 
            'INSERT', 
            ERROR_MESSAGE(), 
            'Error'
        );

        THROW; -- Re-lanza el error original para manejo externo
    END CATCH;
END;
