USE MiTienditaOnlineDB;
GO
CREATE PROCEDURE EliminarDetalleCarrito
    @fk_id_carrito INT,
    @fk_id_producto INT,
    @fk_id_usuario_operacion INT = NULL -- Opcional, para log
AS
BEGIN
    BEGIN TRANSACTION;

    BEGIN TRY
        DECLARE @estadoCarrito INT;
        DECLARE @existeDetalle INT;

        -- Validar que el carrito exista y esté pendiente
        SELECT @estadoCarrito = fk_estado
        FROM Carrito
        WHERE pk_id_carrito = @fk_id_carrito;

        IF @estadoCarrito IS NULL
        BEGIN
            ROLLBACK TRANSACTION;
            THROW 50000, 'El carrito no existe.', 1;
        END

        IF @estadoCarrito <> 3
        BEGIN
            ROLLBACK TRANSACTION;
            THROW 50001, 'No se pueden eliminar detalles de un carrito que no esté pendiente.', 1;
        END

        -- Validar que el producto exista en el detalle del carrito
        SELECT @existeDetalle = COUNT(*)
        FROM Detalle_Carrito
        WHERE fk_id_carrito = @fk_id_carrito
          AND fk_id_producto = @fk_id_producto;

        IF @existeDetalle = 0
        BEGIN
            ROLLBACK TRANSACTION;
            THROW 50002, 'El producto no existe en el detalle del carrito.', 1;
        END

        -- Eliminar el detalle
        DELETE FROM Detalle_Carrito
        WHERE fk_id_carrito = @fk_id_carrito
          AND fk_id_producto = @fk_id_producto;

        -- Actualizar total del carrito
        UPDATE Carrito
        SET total = ISNULL((SELECT SUM(subtotal) FROM Detalle_Carrito WHERE fk_id_carrito = @fk_id_carrito), 0)
        WHERE pk_id_carrito = @fk_id_carrito;

        -- Registrar en el log
        INSERT INTO Log (fechaHora, fk_id_usuario, entidadAfectada, operacion, detalles, resultado)
        VALUES (
            GETDATE(),
            @fk_id_usuario_operacion,
            'Detalle_Carrito',
            'DELETE',
            CONCAT('Detalle eliminado. Carrito ID: ', @fk_id_carrito, 
                   ', Producto ID: ', @fk_id_producto),
            'Éxito'
        );

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        -- Registrar el error en el log
        INSERT INTO Log (fechaHora, fk_id_usuario, entidadAfectada, operacion, detalles, resultado)
        VALUES (
            GETDATE(),
            @fk_id_usuario_operacion,
            'Detalle_Carrito',
            'DELETE',
            ERROR_MESSAGE(),
            'Error'
        );
        
        THROW; -- Re-lanzar el error original
    END CATCH;
END;
