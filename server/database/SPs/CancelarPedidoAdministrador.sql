USE MiTienditaOnlineDB;
GO

CREATE PROCEDURE CancelarPedidoAdministrador
    @pk_id_pedido INT,
    @fk_id_usuario_operacion INT -- ID del administrador que cancela el pedido
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRANSACTION;

    BEGIN TRY
        DECLARE @estadoPedido INT;
        DECLARE @fk_cliente INT;
        DECLARE @total DECIMAL(10,2);

        -- 1. Verificar que el pedido existe y está en estado "En proceso" (4)
        SELECT 
            @estadoPedido = fk_estado,
            @fk_cliente = fk_cliente,
            @total = total
        FROM 
            Pedidos
        WHERE 
            pk_id_pedido = @pk_id_pedido;

        IF @estadoPedido IS NULL
        BEGIN
            ROLLBACK TRANSACTION;
            THROW 50000, 'El pedido especificado no existe.', 1;
        END

        IF @estadoPedido <> 4 -- 4 es "En proceso"
        BEGIN
            ROLLBACK TRANSACTION;
            THROW 50001, 'Solo se pueden cancelar pedidos en estado "En proceso".', 1;
        END

        -- 2. Obtener los detalles del pedido para actualizar el stock
        -- Crear una tabla temporal para almacenar los productos y cantidades
        CREATE TABLE #DetallePedido (
            fk_id_producto INT,
            cantidad INT
        );

        INSERT INTO #DetallePedido (fk_id_producto, cantidad)
        SELECT 
            fk_id_producto,
            cantidad
        FROM 
            Detalle_Pedido
        WHERE 
            fk_id_pedido = @pk_id_pedido;

        -- 3. Actualizar el stock de los productos
        UPDATE p
        SET p.stock = p.stock + dp.cantidad
        FROM Productos p
        INNER JOIN #DetallePedido dp ON p.pk_id_producto = dp.fk_id_producto;

        -- 4. Actualizar el estado del pedido a "Cancelado" (6)
        UPDATE Pedidos
        SET fk_estado = 6 -- 6 es "Cancelado POR ADMIN"
        WHERE pk_id_pedido = @pk_id_pedido;

        -- 5. Registrar la operación en el log
        -- Registrar la cancelación del pedido
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
            @fk_id_usuario_operacion, 
            'Pedidos', 
            'UPDATE', 
            CONCAT('Pedido Cancelado POR ADMIN. ID: ', @pk_id_pedido, 
                   ', Cliente ID: ', @fk_cliente, 
                   ', Total: ', @total), 
            'Éxito'
        );

        -- Registrar la actualización del stock de los productos
        INSERT INTO Log (
            fechaHora, 
            fk_id_usuario, 
            entidadAfectada, 
            operacion, 
            detalles, 
            resultado
        )
        SELECT 
            GETDATE(),
            @fk_id_usuario_operacion,
            'Productos',
            'UPDATE',
            CONCAT('Stock actualizado por cancelación de pedido ID: ', @pk_id_pedido, 
                   ', Producto ID: ', dp.fk_id_producto, 
                   ', Cantidad agregada al stock: ', dp.cantidad),
            'Éxito'
        FROM 
            #DetallePedido dp;

        -- 6. Confirmar la transacción
        COMMIT TRANSACTION;

        -- Limpiar la tabla temporal
        DROP TABLE #DetallePedido;
    END TRY
    BEGIN CATCH
        -- Si hay una transacción abierta, revertirla
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        -- Obtener información del error
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();

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
            @fk_id_usuario_operacion, 
            'Pedidos', 
            'UPDATE', 
            @ErrorMessage, 
            'Error'
        );

        -- Registrar el error en la tabla Log para Productos si es necesario
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
            @fk_id_usuario_operacion, 
            'Productos', 
            'UPDATE', 
            'Error al actualizar el stock de los productos debido a la cancelación del pedido.',
            'Error'
        );

        -- Re-lanzar el error original para manejo externo
        THROW;
    END CATCH
END;
GO
