USE MiTienditaOnlineDB;
GO

CREATE PROCEDURE ActivarCategoria
    @pk_id_categoria INT,
    @id_usuario_accion INT
AS
BEGIN
    BEGIN TRY
        -- Actualizar estado de la categoría a Activo
        UPDATE Categorias
        SET fk_estado = 1
        WHERE pk_id_categoria = @pk_id_categoria;

        -- Registrar en el log
        INSERT INTO log (fechaHora, fk_id_usuario, entidadAfectada, operacion, detalles, resultado)
        VALUES (
            GETDATE(),
            @id_usuario_accion,
            'Categorias',
            'ACTIVACIÓN',
            CONCAT('La categoría con ID ', @pk_id_categoria, ' fue activada.'),
            'Éxito'
        );
    END TRY
    BEGIN CATCH
        -- Manejo de errores y registro en el log
        INSERT INTO log (fechaHora, fk_id_usuario, entidadAfectada, operacion, detalles, resultado)
        VALUES (
            GETDATE(),
            @id_usuario_accion,
            'Categorias',
            'ACTIVACIÓN',
            ERROR_MESSAGE(),
            'Error'
        );
    END CATCH
END;
