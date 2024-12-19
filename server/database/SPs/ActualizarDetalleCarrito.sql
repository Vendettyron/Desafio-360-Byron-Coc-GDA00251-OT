USE MiTienditaOnlineDB;
GO

CREATE PROCEDURE ActualizarDetalleCarrito
    @fk_id_usuario INT,
    @fk_id_producto INT,
    @nueva_cantidad INT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRANSACTION;

    BEGIN TRY
        DECLARE @pk_id_carrito INT;
        DECLARE @estadoCarrito INT;
        DECLARE @precio_unitario DECIMAL(10,2);
        DECLARE @subtotal DECIMAL(10,2);

        -- 1. Obtener el ID del carrito pendiente del usuario
        SELECT @pk_id_carrito = pk_id_carrito
        FROM Carrito
        WHERE fk_id_usuario = @fk_id_usuario
          AND fk_estado = 3; -- Estado "Pendiente"

        -- 2. Validar que el carrito exista
        IF @pk_id_carrito IS NULL
        BEGIN
            ROLLBACK TRANSACTION;
            THROW 50000, 'No existe un carrito pendiente para este usuario.', 1;
        END

        -- 3. Validar que el carrito esté en estado "Pendiente"
        SELECT @estadoCarrito = fk_estado
        FROM Carrito
        WHERE pk_id_carrito = @pk_id_carrito;

        IF @estadoCarrito <> 3
        BEGIN
            ROLLBACK TRANSACTION;
            THROW 50001, 'No se pueden actualizar detalles de un carrito que no está pendiente.', 1;
        END

        -- 4. Validar que el producto exista en el detalle del carrito
        SELECT @precio_unitario = precio_unitario
        FROM Detalle_Carrito
        WHERE fk_id_carrito = @pk_id_carrito
          AND fk_id_producto = @fk_id_producto;

        IF @precio_unitario IS NULL
        BEGIN
            ROLLBACK TRANSACTION;
            THROW 50002, 'El producto no existe en el detalle del carrito.', 1;
        END

        -- 5. Validar nueva cantidad
        IF @nueva_cantidad < 0
        BEGIN
            ROLLBACK TRANSACTION;
            THROW 50003, 'La cantidad no puede ser negativa.', 1;
        END

        IF @nueva_cantidad = 0
        BEGIN
            -- Eliminar el detalle del carrito
            DELETE FROM Detalle_Carrito
            WHERE fk_id_carrito = @pk_id_carrito
              AND fk_id_producto = @fk_id_producto;

            -- Actualizar total del carrito
            UPDATE Carrito
            SET total = ISNULL((SELECT SUM(subtotal) FROM Detalle_Carrito WHERE fk_id_carrito = @pk_id_carrito), 0)
            WHERE pk_id_carrito = @pk_id_carrito;

            -- Registrar en el log
            INSERT INTO Log (fechaHora, fk_id_usuario, entidadAfectada, operacion, detalles, resultado)
            VALUES (
                GETDATE(),
                @fk_id_usuario,
                'Detalle_Carrito',
                'DELETE',
                CONCAT('Detalle eliminado. Usuario ID: ', @fk_id_usuario, 
                       ', Producto ID: ', @fk_id_producto),
                'Éxito'
            );
        END
        ELSE
        BEGIN
            -- Calcular el nuevo subtotal
            SET @subtotal = @nueva_cantidad * @precio_unitario;

            -- Actualizar el detalle con la nueva cantidad
            UPDATE Detalle_Carrito
            SET cantidad = @nueva_cantidad,
                subtotal = @subtotal
            WHERE fk_id_carrito = @pk_id_carrito
              AND fk_id_producto = @fk_id_producto;

            -- Actualizar el total del carrito
            UPDATE Carrito
            SET total = (SELECT SUM(subtotal) FROM Detalle_Carrito WHERE fk_id_carrito = @pk_id_carrito)
            WHERE pk_id_carrito = @pk_id_carrito;

            -- Registrar en el log
            INSERT INTO Log (fechaHora, fk_id_usuario, entidadAfectada, operacion, detalles, resultado)
            VALUES (
                GETDATE(),
                @fk_id_usuario,
                'Detalle_Carrito',
                'UPDATE',
                CONCAT('Detalle actualizado. Usuario ID: ', @fk_id_usuario,
                       ', Producto ID: ', @fk_id_producto, 
                       ', Nueva cantidad: ', @nueva_cantidad,
                       ', Nuevo subtotal: ', @subtotal),
                'Éxito'
            );
        END

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
            'UPDATE',
            ERROR_MESSAGE(),
            'Error'
        );

        THROW; -- Re-lanzar el error original
    END CATCH
END;
GO
