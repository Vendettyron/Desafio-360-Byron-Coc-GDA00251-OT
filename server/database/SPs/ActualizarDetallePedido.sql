USE MiTienditaOnlineDB;
GO

CREATE PROCEDURE ActualizarDetallePedido
    @fk_id_usuario INT,         -- ID del usuario que realiza la operación
    @fk_id_pedido INT,          -- ID del pedido que se desea actualizar
    @fk_id_producto INT,        -- ID del producto en el pedido
    @nueva_cantidad INT         -- Nueva cantidad del producto
AS
BEGIN
    SET NOCOUNT ON;

    -- Iniciar la transacción
    BEGIN TRANSACTION;

    BEGIN TRY
        DECLARE @estadoPedido INT;
        DECLARE @fk_cliente INT;
        DECLARE @precio DECIMAL(10,2);
        DECLARE @subtotal_antiguo DECIMAL(10,2);
        DECLARE @subtotal_nuevo DECIMAL(10,2);
        DECLARE @total_nuevo DECIMAL(10,2);
        DECLARE @cantidad_antigua INT;

        -- 1. Verificar que el usuario exista
        IF NOT EXISTS (SELECT 1 FROM Usuarios WHERE pk_id_usuario = @fk_id_usuario)
        BEGIN
            ROLLBACK TRANSACTION;
            THROW 50000, 'El usuario especificado no existe.', 1;
        END

        -- 2. Verificar que el pedido exista, pertenezca al usuario y esté en estado "En proceso" (4)
        SELECT 
            @estadoPedido = fk_estado,
            @fk_cliente = fk_cliente
        FROM 
            Pedidos
        WHERE 
            pk_id_pedido = @fk_id_pedido
            AND fk_cliente = @fk_id_usuario
            AND fk_estado = 4; -- Estado "4" es "En proceso"

        IF @estadoPedido IS NULL
        BEGIN
            ROLLBACK TRANSACTION;
            THROW 50001, 'No existe un pedido en estado "En proceso" para este usuario con el ID proporcionado.', 1;
        END

        -- 3. Verificar que el producto existe y está activo 
        SELECT 
            @precio = precio
        FROM 
            Productos
        WHERE 
            pk_id_producto = @fk_id_producto
            AND fk_estado = 1; -- producto está activo

        IF @precio IS NULL
        BEGIN
            ROLLBACK TRANSACTION;
            THROW 50002, 'El producto especificado no existe o no está activo.', 1;
        END

        -- 4. Validar que la nueva cantidad no sea negativa
        IF @nueva_cantidad < 0
        BEGIN
            ROLLBACK TRANSACTION;
            THROW 50003, 'La cantidad no puede ser negativa.', 1;
        END

        -- 5. Verificar si el detalle del pedido (producto) existe en el pedido especificado
        SELECT 
            @cantidad_antigua = cantidad,
            @subtotal_antiguo = subtotal
        FROM 
            Detalle_Pedido
        WHERE 
            fk_id_pedido = @fk_id_pedido
            AND fk_id_producto = @fk_id_producto;

        IF @cantidad_antigua IS NULL
        BEGIN
            ROLLBACK TRANSACTION;
            THROW 50004, 'El producto especificado no existe en el pedido.', 1;
        END

        -- 6. Verificar y realizar la actualización o eliminación según la nueva cantidad
        IF @nueva_cantidad = 0
        BEGIN
            -- 6.1. Eliminar el detalle del pedido
            DELETE FROM Detalle_Pedido
            WHERE 
                fk_id_pedido = @fk_id_pedido
                AND fk_id_producto = @fk_id_producto;

            -- 6.2. Recalcular y actualizar el total del pedido
            SELECT @total_nuevo = SUM(subtotal)
            FROM Detalle_Pedido
            WHERE fk_id_pedido = @fk_id_pedido;

            UPDATE Pedidos
            SET total = ISNULL(@total_nuevo, 0)
            WHERE pk_id_pedido = @fk_id_pedido;

            -- 6.3. Registrar la operación en el Log
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
                       ', Cantidad eliminada: ', @cantidad_antigua, 
                       ', Subtotal eliminado: ', @subtotal_antiguo), 
                'Éxito'
            );
        END
        ELSE
        BEGIN
            -- 6.4. Calcular el nuevo subtotal
            SET @subtotal_nuevo = @nueva_cantidad * @precio;

            -- 6.5. Actualizar el detalle del pedido
            UPDATE Detalle_Pedido
            SET 
                cantidad = @nueva_cantidad,
                subtotal = @subtotal_nuevo
            WHERE 
                fk_id_pedido = @fk_id_pedido
                AND fk_id_producto = @fk_id_producto;

            -- 6.6. Recalcular y actualizar el total del pedido
            SELECT @total_nuevo = SUM(subtotal)
            FROM Detalle_Pedido
            WHERE fk_id_pedido = @fk_id_pedido;

            UPDATE Pedidos
            SET total = ISNULL(@total_nuevo, 0)
            WHERE pk_id_pedido = @fk_id_pedido;

            -- 6.7. Registrar la operación en el Log
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
                'UPDATE', 
                CONCAT('Detalle actualizado en Pedido ID: ', @fk_id_pedido, 
                       ', Producto ID: ', @fk_id_producto, 
                       ', Cantidad antigua: ', @cantidad_antigua, 
                       ', Nueva cantidad: ', @nueva_cantidad, 
                       ', Subtotal antiguo: ', @subtotal_antiguo, 
                       ', Subtotal nuevo: ', @subtotal_nuevo), 
                'Éxito'
            );
        END

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
            'UPDATE/DELETE', 
            @ErrorMessage, 
            'Error'
        );

        -- Re-lanzar el error para manejo externo
        THROW;
    END CATCH;
END;
GO
