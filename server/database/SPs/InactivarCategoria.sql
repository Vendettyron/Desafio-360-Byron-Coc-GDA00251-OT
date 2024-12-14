USE MiTienditaOnlineDB;
GO
CREATE PROCEDURE InactivarCategoria
    @id_categoria INT,
    @fk_id_usuario INT -- Usuario que realiza la operación
AS
BEGIN
    BEGIN TRANSACTION;
    BEGIN TRY
        -- Actualizar el estado de la categoría a "Inactivo"
        UPDATE Categorias
        SET fk_estado = 2 -- Suponiendo que 2 es el estado "Inactivo"
        WHERE pk_id_categoria = @id_categoria;

        -- Registrar en Log
        INSERT INTO Log (fechaHora, fk_id_usuario, entidadAfectada, operacion, detalles, resultado)
        VALUES (
            GETDATE(),
            @fk_id_usuario,
            'Categorias',
            'UPDATE',
            CONCAT('Categoría inactivada: ID=', @id_categoria),
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
