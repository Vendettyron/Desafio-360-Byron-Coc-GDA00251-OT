USE MiTienditaOnlineDB;
GO

CREATE PROCEDURE InactivarProducto
    @id_producto INT,
    @fk_id_usuario INT -- Usuario que realiza la operación
AS
BEGIN
    BEGIN TRANSACTION;
    BEGIN TRY
        -- Actualizar el estado del producto a "Inactivo"
        UPDATE Productos
        SET fk_estado = 2 --  2 es el estado "Inactivo"
        WHERE pk_id_producto = @id_producto;

        -- Registrar en Log
        INSERT INTO Log (fechaHora, fk_id_usuario, entidadAfectada, operacion, detalles, resultado)
        VALUES (
            GETDATE(),
            @fk_id_usuario,
            'Productos',
            'UPDATE',
            CONCAT('Producto inactivado: ID=', @id_producto),
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
            'Productos',
            'UPDATE',
            ERROR_MESSAGE(),
            'Error'
        );
        THROW;
    END CATCH;
END;