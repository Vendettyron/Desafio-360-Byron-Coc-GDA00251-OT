USE MiTienditaOnlineDB;
GO

CREATE PROCEDURE InsertarDetallePedido
    @fk_id_usuario INT,        -- ID del usuario que realiza la operación
    @fk_id_pedido INT,         -- ID del pedido al que se desea agregar o actualizar el detalle
    @fk_id_producto INT,       -- ID del producto que se desea agregar o actualizar en el pedido
    @cantidad INT              -- Cantidad del producto
AS
BEGIN
    SET NOCOUNT ON;

    -- Iniciar la transacción
    BEGIN TRANSACTION;

    BEGIN TRY
        DECLARE @estadoPedido INT;
        DECLARE @precio DECIMAL(10,2);
        DECLARE @subtotal DECIMAL(10,2);
        DECLARE @existeDetalle INT;
        DECLARE @cantidad_antigua INT;
        DECLARE @subtotal_antiguo DECIMAL(10,2);
        DECLARE @subtotal_nuevo DECIMAL(10,2);
        DECLARE @total_nuevo DECIMAL(10,2);

        -- 1. Verificar que el usuario exista
        IF NOT EXISTS (SELECT 1 FROM Usuarios WHERE pk_id_usuario = @fk_id_usuario)
        BEGIN
            ROLLBACK TRANSACTION;
            THROW 50000, 'El usuario especificado no existe.', 1;
        END

        -- 2. Verificar que el pedido exista, pertenezca al usuario y esté en estado "En proceso" (4)
        SELECT 
            @estadoPedido = fk_estado
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
            AND fk_estado = 1; -- Asumiendo que fk_estado = 1 indica que el producto está activo

        IF @precio IS NULL
        BEGIN
            ROLLBACK TRANSACTION;
            THROW 50002, 'El producto especificado no existe o no está activo.', 1;
        END

        -- 4. Validar que la cantidad es mayor a cero
        IF @cantidad <= 0
        BEGIN
            ROLLBACK TRANSACTION;
            THROW 50003, 'La cantidad debe ser mayor a cero.', 1;
        END

        -- 5. Verificar si el producto ya existe en el detalle del pedido
        SELECT 
            @existeDetalle = COUNT(*)
        FROM 
            Detalle_Pedido
        WHERE 
            fk_id_pedido = @fk_id_pedido
            AND fk_id_producto = @fk_id_producto;

        IF @existeDetalle > 0
        BEGIN
            -- 6.1. Obtener la cantidad y subtotal antiguos para el log
            SELECT 
                @cantidad_antigua = cantidad,
                @subtotal_antiguo = subtotal
            FROM 
                Detalle_Pedido
            WHERE 
                fk_id_pedido = @fk_id_pedido
                AND fk_id_producto = @fk_id_producto;

            -- 6.2. Actualizar la cantidad y el subtotal del detalle del pedido
            UPDATE Detalle_Pedido
            SET 
                cantidad = cantidad + @cantidad,
                subtotal = (cantidad + @cantidad) * precio_unitario
            WHERE 
                fk_id_pedido = @fk_id_pedido
                AND fk_id_producto = @fk_id_producto;

            -- 6.3. Recalcular y actualizar el total del pedido
            SELECT @total_nuevo = SUM(subtotal)
            FROM Detalle_Pedido
            WHERE fk_id_pedido = @fk_id_pedido;

            UPDATE Pedidos
            SET total = ISNULL(@total_nuevo, 0)
            WHERE pk_id_pedido = @fk_id_pedido;

            -- 6.4. Calcular el nuevo subtotal para el log
            SELECT @subtotal_nuevo = subtotal
            FROM Detalle_Pedido
            WHERE fk_id_pedido = @fk_id_pedido
              AND fk_id_producto = @fk_id_producto;

            -- 6.5. Registrar la operación en el Log
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
                       ', Cantidad agregada: ', @cantidad, 
                       ', Cantidad antigua: ', @cantidad_antigua, 
                       ', Nueva cantidad: ', (SELECT cantidad FROM Detalle_Pedido WHERE fk_id_pedido = @fk_id_pedido AND fk_id_producto = @fk_id_producto),
                       ', Subtotal antiguo: ', @subtotal_antiguo, 
                       ', Subtotal nuevo: ', @subtotal_nuevo), 
                'Éxito'
            );
        END
        ELSE
        BEGIN
            -- 7.1. Calcular el subtotal
            SET @subtotal = @cantidad * @precio;

            -- 7.2. Insertar el nuevo detalle en Detalle_Pedido
            INSERT INTO Detalle_Pedido (fk_id_pedido, fk_id_producto, precio_unitario, cantidad, subtotal)
            VALUES (@fk_id_pedido, @fk_id_producto, @precio, @cantidad, @subtotal);

            -- 7.3. Recalcular y actualizar el total del pedido
            SELECT @total_nuevo = SUM(subtotal)
            FROM Detalle_Pedido
            WHERE fk_id_pedido = @fk_id_pedido;

            UPDATE Pedidos
            SET total = ISNULL(@total_nuevo, 0)
            WHERE pk_id_pedido = @fk_id_pedido;

            -- 7.4. Registrar la operación en el Log
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
                'INSERT', 
                CONCAT('Detalle insertado en Pedido ID: ', @fk_id_pedido, 
                       ', Producto ID: ', @fk_id_producto, 
                       ', Cantidad: ', @cantidad, 
                       ', Subtotal: ', @subtotal), 
                'Éxito'
            );
        END

        -- 8. Confirmar la transacción
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
            'INSERT/UPDATE', 
            @ErrorMessage, 
            'Error'
        );

        -- Re-lanzar el error para manejo externo
        THROW;
    END CATCH
END;
GO
