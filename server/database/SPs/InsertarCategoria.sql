USE MiTienditaOnlineDB;
GO

CREATE PROCEDURE InsertarCategoria
    @nombre VARCHAR(100),
    @descripcion VARCHAR(MAX),
    @fk_estado INT,
    @fk_id_usuario INT = NULL  -- Parámetro opcional 
AS
BEGIN
    BEGIN TRANSACTION;

    BEGIN TRY
        -- Inserción de la categoría
        INSERT INTO Categorias (nombre, descripcion, fk_estado)
        VALUES (@nombre, @descripcion, @fk_estado);

        -- Registro en la tabla de log
        INSERT INTO Log (fechaHora, fk_id_usuario, entidadAfectada, operacion, detalles, resultado)
        VALUES (
            GETDATE(), 
            @fk_id_usuario, 
            'Categorias', 
            'INSERT', 
            CONCAT('Categoría insertada: ', @nombre, ', estado ID: ', @fk_estado), 
            'Éxito'
        );

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;

        -- Registrar el error en el log
        INSERT INTO Log (fechaHora, fk_id_usuario, entidadAfectada, operacion, detalles, resultado)
        VALUES (
            GETDATE(),
            @fk_id_usuario, 
            'Categorias', 
            'INSERT', 
            ERROR_MESSAGE(), 
            'Error'
        );
        
        THROW;
    END CATCH;
END;
