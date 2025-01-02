USE MiTienditaOnlineDB;
GO
 
CREATE PROCEDURE EliminarDetallesCarrito
    @fk_id_usuario INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;

    BEGIN TRY
        DECLARE @fk_id_carrito INT;
        DECLARE @estadoCarrito INT;
        DECLARE @cantidadDetalles INT;

        -- 1. Obtener el carrito activo (estado = 3) para el usuario
        SELECT TOP 1 
            @fk_id_carrito = pk_id_carrito,
            @estadoCarrito = fk_estado
        FROM Carrito
        WHERE fk_id_usuario = @fk_id_usuario
          AND fk_estado = 3; -- Estado "pendiente" o activo

        IF @fk_id_carrito IS NULL
        BEGIN
            ROLLBACK TRANSACTION;
            THROW 50000, 'No existe un carrito activo para el usuario.', 1;
        END

        -- 2. Verificar que el carrito está en estado pendiente
        IF @estadoCarrito <> 3
        BEGIN
            ROLLBACK TRANSACTION;
            THROW 50001, 'No se pueden eliminar detalles de un carrito que no está pendiente.', 1;
        END

        -- 3. Verificar que existen detalles en el carrito
        SELECT @cantidadDetalles = COUNT(*)
        FROM Detalle_Carrito
        WHERE fk_id_carrito = @fk_id_carrito;

        IF @cantidadDetalles = 0
        BEGIN
            ROLLBACK TRANSACTION;
            THROW 50002, 'El carrito no tiene detalles para eliminar.', 1;
        END

        -- 4. Eliminar todos los detalles del carrito
        DELETE FROM Detalle_Carrito
        WHERE fk_id_carrito = @fk_id_carrito;

        -- 5. Actualizar el total del carrito a 0
        UPDATE Carrito
        SET total = 0
        WHERE pk_id_carrito = @fk_id_carrito;

        -- 6. Registrar la operación en el log
        INSERT INTO Log (fechaHora, fk_id_usuario, entidadAfectada, operacion, detalles, resultado)
        VALUES (
            GETDATE(),
            @fk_id_usuario,
            'Detalle_Carrito',
            'DELETE_ALL',
            CONCAT('Detalles eliminados del carrito. Carrito ID: ', @fk_id_carrito, ', Usuario ID: ', @fk_id_usuario),
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
            @fk_id_usuario,
            'Detalle_Carrito',
            'DELETE_ALL',
            ERROR_MESSAGE(),
            'Error'
        );

        -- Re-lanzar el error original para manejo externo
        THROW;
    END CATCH;
END;
GO
