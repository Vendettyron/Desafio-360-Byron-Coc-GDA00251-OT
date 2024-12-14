USE MiTienditaOnlineDB;
GO

CREATE PROCEDURE ActivarProducto
    @pk_id_producto INT,
    @id_usuario_accion INT
AS
BEGIN
    BEGIN TRY
        -- Actualizar estado del producto a Activo
        UPDATE Productos
        SET fk_estado = 1
        WHERE pk_id_producto = @pk_id_producto;

        -- Registrar en el log
        INSERT INTO log (fechaHora, fk_id_usuario, entidadAfectada, operacion, detalles, resultado)
        VALUES (
            GETDATE(),
            @id_usuario_accion,
            'Productos',
            'ACTIVACIÓN',
            CONCAT('El producto con ID ', @pk_id_producto, ' fue activado.'),
            'Éxito'
        );
    END TRY
    BEGIN CATCH
        -- Manejo de errores y registro en el log
        INSERT INTO log (fechaHora, fk_id_usuario, entidadAfectada, operacion, detalles, resultado)
        VALUES (
            GETDATE(),
            @id_usuario_accion,
            'Productos',
            'ACTIVACIÓN',
            ERROR_MESSAGE(),
            'Error'
        );
    END CATCH
END;