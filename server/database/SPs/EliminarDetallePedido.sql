USE MiTienditaOnlineDB;
GO

CREATE PROCEDURE EliminarDetallePedido
    @fk_id_usuario INT,        -- ID del usuario que realiza la operación
    @fk_id_pedido INT,         -- ID del pedido del cual se desea eliminar el detalle
    @fk_id_producto INT        -- ID del producto que se desea eliminar del pedido
AS
BEGIN
    SET NOCOUNT ON;

    -- Iniciar la transacción
    BEGIN TRANSACTION;

    BEGIN TRY
        DECLARE @estadoPedido INT;
        DECLARE @total_antiguo DECIMAL(10,2);
        DECLARE @total_nuevo DECIMAL(10,2);
        DECLARE @cantidad_eliminada INT;
        DECLARE @precio_unitario DECIMAL(10,2);
        DECLARE @subtotal_eliminado DECIMAL(10,2);

        -- 1. Verificar que el usuario exista
        IF NOT EXISTS (SELECT 1 FROM Usuarios WHERE pk_id_usuario = @fk_id_usuario)
        BEGIN
            ROLLBACK TRANSACTION;
            THROW 50000, 'El usuario especificado no existe.', 1;
        END

        -- 2. Verificar que el pedido exista, pertenezca al usuario y esté en estado "En proceso" (4)
        SELECT 
            @estadoPedido = fk_estado,
            @total_antiguo = total
        FROM 
            Pedidos
        WHERE 
            pk_id_pedido = @fk_id_pedido
            AND fk_cliente = @fk_id_usuario
            AND fk_estado = 4; -- Estado "En proceso"

        IF @estadoPedido IS NULL
        BEGIN
            ROLLBACK TRANSACTION;
            THROW 50001, 'No existe un pedido en estado "En proceso" para este usuario con el ID proporcionado.', 1;
        END

        -- 3. Verificar que el detalle del pedido (producto) existe
        SELECT 
            @cantidad_eliminada = cantidad,
            @precio_unitario = precio_unitario,
            @subtotal_eliminado = subtotal
        FROM 
            Detalle_Pedido
        WHERE 
            fk_id_pedido = @fk_id_pedido
            AND fk_id_producto = @fk_id_producto;

        IF @precio_unitario IS NULL
        BEGIN
            ROLLBACK TRANSACTION;
            THROW 50002, 'El producto especificado no existe en el pedido.', 1;
        END

        -- 4. Eliminar el detalle del pedido
        DELETE FROM Detalle_Pedido
        WHERE 
            fk_id_pedido = @fk_id_pedido
            AND fk_id_producto = @fk_id_producto;

        -- 5. Recalcular y actualizar el total del pedido
        SELECT @total_nuevo = SUM(subtotal)
        FROM Detalle_Pedido
        WHERE fk_id_pedido = @fk_id_pedido;

        UPDATE Pedidos
        SET total = ISNULL(@total_nuevo, 0)
        WHERE pk_id_pedido = @fk_id_pedido;

        -- 6. Registrar la operación en el Log
        INSERT INTO Log (
            fechaHora, 
            fk_id_usuario, 
            entidadAfectada, 
            operacion, 
            detalles, 
            resultado
        )
        VALUES (
            GETDATE(), 
            @fk_id_usuario, 
            'Detalle_Pedido', 
            'DELETE', 
            CONCAT('Detalle eliminado de Pedido ID: ', @fk_id_pedido, 
                   ', Producto ID: ', @fk_id_producto, 
                   ', Cantidad eliminada: ', @cantidad_eliminada, 
                   ', Subtotal eliminado: ', @subtotal_eliminado), 
            'Éxito'
        );

        -- 7. Confirmar la transacción
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        -- Revertir la transacción en caso de error
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        -- Capturar detalles del error
        DECLARE @ErrorMessage NVARCHAR(4000);
        DECLARE @ErrorSeverity INT;
        DECLARE @ErrorState INT;

        SELECT 
            @ErrorMessage = ERROR_MESSAGE(),
            @ErrorSeverity = ERROR_SEVERITY(),
            @ErrorState = ERROR_STATE();

        -- Registrar el error en la tabla Log
        INSERT INTO Log (
            fechaHora, 
            fk_id_usuario, 
            entidadAfectada, 
            operacion, 
            detalles, 
            resultado
        )
        VALUES (
            GETDATE(), 
            @fk_id_usuario, 
            'Detalle_Pedido', 
            'DELETE', 
            @ErrorMessage, 
            'Error'
        );

        -- Re-lanzar el error para manejo externo
        THROW;
    END CATCH
END;
GO
