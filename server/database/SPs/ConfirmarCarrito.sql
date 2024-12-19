USE MiTienditaOnlineDB;
GO

CREATE PROCEDURE ConfirmarCarrito
    @fk_id_usuario INT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRANSACTION;

    BEGIN TRY
        DECLARE @pk_id_carrito INT;
        DECLARE @estadoCarrito INT;
        DECLARE @fk_cliente INT;
        DECLARE @total DECIMAL(10,2);
        DECLARE @pk_id_pedido INT;

        -- 1. Obtener el ID del carrito pendiente del usuario
        SELECT @pk_id_carrito = pk_id_carrito,
               @estadoCarrito = fk_estado,
               @fk_cliente = fk_id_usuario,
               @total = total
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
        IF @estadoCarrito <> 3
        BEGIN
            ROLLBACK TRANSACTION;
            THROW 50001, 'El carrito debe estar en estado Pendiente para poder confirmarse.', 1;
        END

        -- 4. Crear el pedido con estado "En proceso" (4)
        INSERT INTO Pedidos (fk_cliente, fk_estado, total)
        VALUES (@fk_cliente, 4, @total);

        SET @pk_id_pedido = SCOPE_IDENTITY();

        -- 5. Copiar el detalle del carrito a detalle_pedido
        INSERT INTO Detalle_Pedido (fk_id_pedido, fk_id_producto, precio_unitario, cantidad, subtotal)
        SELECT @pk_id_pedido, fk_id_producto, precio_unitario, cantidad, subtotal
        FROM Detalle_Carrito
        WHERE fk_id_carrito = @pk_id_carrito;

        -- 6. Actualizar el estado del carrito a Inactivo (2)
        UPDATE Carrito
        SET fk_estado = 2
        WHERE pk_id_carrito = @pk_id_carrito;

        -- 7. Registrar en el log la confirmación del carrito
        INSERT INTO Log (fechaHora, fk_id_usuario, entidadAfectada, operacion, detalles, resultado)
        VALUES (
            GETDATE(),
            @fk_id_usuario,
            'Carrito',
            'UPDATE',
            CONCAT('Carrito confirmado y convertido a pedido. Usuario ID: ', @fk_id_usuario, 
                   ', Pedido ID: ', @pk_id_pedido, 
                   ', Total: ', @total),
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
            'Carrito',
            'UPDATE',
            ERROR_MESSAGE(),
            'Error'
        );
        
        THROW; -- Re-lanzar el error original
    END CATCH
END;
GO
