USE MiTienditaOnlineDB;
GO

CREATE PROCEDURE ActualizarEstado
    @pk_id_estado INT,
    @nombre VARCHAR(50),
    @fk_id_usuario_operacion INT = NULL -- Parámetro opcional para el log
AS
BEGIN
    BEGIN TRANSACTION;

    BEGIN TRY
        DECLARE @nombre_antiguo VARCHAR(50);

        -- Obtener el nombre antiguo del estado
        SELECT @nombre_antiguo = nombre
        FROM Estados
        WHERE pk_id_estado = @pk_id_estado;

        IF @nombre_antiguo IS NULL
        BEGIN
            ROLLBACK TRANSACTION;
            THROW 50000, 'El estado especificado no existe.', 1;
        END

        -- Actualizar el nombre del estado
        UPDATE Estados
        SET nombre = @nombre
        WHERE pk_id_estado = @pk_id_estado;

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
            'UPDATE', 
            CONCAT('Estado actualizado. ID: ', @pk_id_estado, 
                   ', Nombre anterior: ', @nombre_antiguo, 
                   ', Nuevo nombre: ', @nombre), 
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
            'UPDATE', 
            ERROR_MESSAGE(), 
            'Error'
        );

        THROW; -- Re-lanza el error original para manejo externo
    END CATCH;
END;
