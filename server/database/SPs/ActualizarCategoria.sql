USE MiTienditaOnlineDB;
GO

CREATE PROCEDURE ActualizarCategoria
    @id_categoria INT,
    @nombre NVARCHAR(100),
    @descripcion NVARCHAR(MAX),
    @fk_estado INT,
    @fk_id_usuario INT -- Usuario que realiza la operación
AS
BEGIN
    BEGIN TRANSACTION;
    BEGIN TRY
        -- Actualizar los datos de la categoría
        UPDATE Categorias
        SET nombre = @nombre,
            descripcion = @descripcion,
            fk_estado = @fk_estado
        WHERE pk_id_categoria = @id_categoria;

        -- Registrar en Log
        INSERT INTO Log (fechaHora, fk_id_usuario, entidadAfectada, operacion, detalles, resultado)
        VALUES (
            GETDATE(),
            @fk_id_usuario,
            'Categorias',
            'UPDATE',
            CONCAT('Categoría actualizada: ID=', @id_categoria, ', Nombre=', @nombre, ', Estado=', @fk_estado),
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
            'Categorias',
            'UPDATE',
            ERROR_MESSAGE(),
            'Error'
        );
        THROW;
    END CATCH;
END;