USE MiTienditaOnlineDB;
GO


CREATE PROCEDURE ObtenerDetallesPedido
    @fk_id_usuario INT,            -- ID del cliente
    @pk_id_pedido INT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        -- Iniciar la transacción
        BEGIN TRANSACTION;

        DECLARE @estadoPedido INT;
        DECLARE @total DECIMAL(10,2);
        DECLARE @fecha_pedido DATETIME;

        -- 1. Verificar que el cliente existe
        IF NOT EXISTS (SELECT 1 FROM Usuarios WHERE pk_id_usuario = @fk_id_usuario)
        BEGIN
            ROLLBACK TRANSACTION;
            THROW 50000, 'El cliente especificado no existe.', 1;
        END

        -- 2. Verificar que el pedido existe, pertenece al cliente y está en estado "4" (Pendiente)
        SELECT 
            @estadoPedido = fk_estado,
            @total = total,
            @fecha_pedido = fecha_pedido
        FROM 
            Pedidos
        WHERE 
            pk_id_pedido = @pk_id_pedido
            AND fk_cliente = @fk_id_usuario

        IF @estadoPedido IS NULL
        BEGIN
            ROLLBACK TRANSACTION;
            THROW 50001, 'No existe un pedido en estado "Pendiente" para este usuario con el ID proporcionado.', 1;
        END

        -- 3. Obtener los detalles del pedido junto con la información de los productos
        SELECT 
            p.fk_estado AS estado,
            p.total,
            p.fecha_pedido,
            p.pk_id_pedido AS id_pedido,
            dp.pk_id_detalle,
            dp.fk_id_producto,
            pr.nombre AS nombre_producto,
            pr.descripcion AS descripcion_producto,
            dp.precio_unitario,
            dp.cantidad,
            dp.subtotal
        FROM 
            Pedidos p
            INNER JOIN Detalle_Pedido dp ON p.pk_id_pedido = dp.fk_id_pedido
            INNER JOIN Productos pr ON dp.fk_id_producto = pr.pk_id_producto
        WHERE 
            p.pk_id_pedido = @pk_id_pedido
            AND p.fk_cliente = @fk_id_usuario

        -- 4. Registrar la operación en la tabla Log
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
            'Pedidos y Detalle_Pedido', 
            'SELECT', 
            CONCAT('Detalles obtenidos para Pedido ID: ', @pk_id_pedido, 
                   ', Cliente ID: ', @fk_id_usuario, 
                   ', Total: ', @total, 
                   ', Fecha Pedido: ', @fecha_pedido), 
            'Éxito'
        );

        -- Confirmar la transacción
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
            'Pedidos y Detalle_Pedido', 
            'SELECT', 
            @ErrorMessage, 
            'Error'
        );

        -- Re-lanzar el error para manejo externo
        THROW;
    END CATCH;
END;
GO
