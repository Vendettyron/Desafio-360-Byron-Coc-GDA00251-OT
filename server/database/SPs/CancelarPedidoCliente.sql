USE MiTienditaOnlineDB;
GO

CREATE PROCEDURE CancelarPedidoCliente
    @fk_id_cliente INT,        -- ID del cliente que desea cancelar el pedido
    @fk_id_pedido INT          -- ID del pedido que se desea cancelar
AS
BEGIN
    SET NOCOUNT ON;

    -- Iniciar la transacci�n
    BEGIN TRANSACTION;

    BEGIN TRY
        DECLARE @estadoPedido INT;
        DECLARE @total DECIMAL(10,2);
        DECLARE @pk_id_pedido INT;

        -- 1. Verificar que el cliente exista
        IF NOT EXISTS (SELECT 1 FROM Usuarios WHERE pk_id_usuario = @fk_id_cliente)
        BEGIN
            ROLLBACK TRANSACTION;
            THROW 50000, 'El cliente especificado no existe.', 1;
        END

        -- 2. Verificar que el pedido exista, pertenezca al cliente y est� en estado "En proceso" (4)
        SELECT 
            @estadoPedido = fk_estado,
            @total = total,
            @pk_id_pedido = pk_id_pedido
        FROM 
            Pedidos
        WHERE 
            pk_id_pedido = @fk_id_pedido
            AND fk_cliente = @fk_id_cliente
            AND fk_estado = 4; -- Estado "En proceso"

        IF @estadoPedido IS NULL
        BEGIN
            ROLLBACK TRANSACTION;
            THROW 50001, 'No existe un pedido en estado "En proceso" para este usuario con el ID proporcionado.', 1;
        END

        -- 3. Obtener los detalles del pedido para actualizar el stock
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
            fk_id_pedido = @fk_id_pedido;

        -- 4. Actualizar el stock de los productos
        UPDATE p
        SET p.stock = p.stock + dp.cantidad
        FROM Productos p
        INNER JOIN #DetallePedido dp ON p.pk_id_producto = dp.fk_id_producto;

        -- 5. Actualizar el estado del pedido a "Cancelado por Cliente" (7)
        UPDATE Pedidos
        SET fk_estado = 7 -- 7 es "Cancelado por Cliente"
        WHERE pk_id_pedido = @fk_id_pedido;

        -- 6. Registrar la operaci�n en el log
        -- Registrar la cancelaci�n del pedido
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
            @fk_id_cliente, 
            'Pedidos', 
            'UPDATE', 
            CONCAT('Pedido cancelado por Cliente. ID: ', @fk_id_pedido, 
                   ', Cliente ID: ', @fk_id_cliente, 
                   ', Total: ', @total), 
            '�xito'
        );

        -- Registrar la actualizaci�n del stock de los productos
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
            @fk_id_cliente,
            'Productos',
            'UPDATE',
            CONCAT('Stock actualizado por cancelaci�n de pedido ID: ', @fk_id_pedido, 
                   ', Producto ID: ', dp.fk_id_producto, 
                   ', Cantidad agregada al stock: ', dp.cantidad),
            '�xito'
        FROM 
            #DetallePedido dp;

        -- 7. Confirmar la transacci�n
        COMMIT TRANSACTION;

        -- Limpiar la tabla temporal
        DROP TABLE #DetallePedido;
    END TRY
    BEGIN CATCH
        -- Si hay una transacci�n abierta, revertirla
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        -- Obtener informaci�n del error
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
            @fk_id_cliente, 
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
            @fk_id_cliente, 
            'Productos', 
            'UPDATE', 
            'Error al actualizar el stock de los productos debido a la cancelaci�n del pedido.',
            'Error'
        );

        -- Re-lanzar el error original para manejo externo
        THROW;
    END CATCH
END;
GO
