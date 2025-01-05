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

        -- 4. Verificar el stock de cada producto en el carrito
        -- Crear una tabla temporal para almacenar los productos con stock insuficiente
        CREATE TABLE #ProductosInsuficientes (
            pk_id_producto INT,
            nombre VARCHAR(100),
            cantidad_solicitada INT,
            stock_disponible INT
        );

        -- Insertar productos con stock insuficiente en la tabla temporal
        INSERT INTO #ProductosInsuficientes (pk_id_producto, nombre, cantidad_solicitada, stock_disponible)
        SELECT p.pk_id_producto, p.nombre, dc.cantidad, p.stock
        FROM Detalle_Carrito dc
        INNER JOIN Productos p ON dc.fk_id_producto = p.pk_id_producto
        WHERE dc.fk_id_carrito = @pk_id_carrito
          AND dc.cantidad > p.stock;

        -- Verificar si existen productos con stock insuficiente
        IF EXISTS (SELECT 1 FROM #ProductosInsuficientes)
        BEGIN
            -- Obtener detalles de los productos insuficientes
            DECLARE @detalles NVARCHAR(MAX) = '';

            SELECT @detalles = STRING_AGG(
                CONCAT('Producto ID: ', pk_id_producto, 
                       ', Nombre: ', nombre, 
                       ', Cantidad Solicitada: ', cantidad_solicitada, 
                       ', Stock Disponible: ', stock_disponible), 
                '; ')
            FROM #ProductosInsuficientes;

            -- Registrar en el log el error de stock insuficiente
            INSERT INTO Log (fechaHora, fk_id_usuario, entidadAfectada, operacion, detalles, resultado)
            VALUES (
                GETDATE(),
                @fk_id_usuario,
                'Carrito',
                'UPDATE',
                CONCAT('Stock insuficiente para los siguientes productos: ', @detalles),
                'Error'
            );

            -- Lanzar un error detallado
            THROW 50002, 'No hay suficiente stock para uno o más productos en el carrito.', 1;
        END

        -- 5. Reducir el stock de los productos en la tabla Productos
        UPDATE p
        SET p.stock = p.stock - dc.cantidad
        FROM Productos p
        INNER JOIN Detalle_Carrito dc ON p.pk_id_producto = dc.fk_id_producto
        WHERE dc.fk_id_carrito = @pk_id_carrito;

        -- 6. Crear el pedido con estado "En proceso" (4)
        INSERT INTO Pedidos (fk_cliente, fk_estado, total)
        VALUES (@fk_cliente, 4, @total);

        SET @pk_id_pedido = SCOPE_IDENTITY();

        -- 7. Copiar el detalle del carrito a detalle_pedido
        INSERT INTO Detalle_Pedido (fk_id_pedido, fk_id_producto, precio_unitario, cantidad, subtotal)
        SELECT @pk_id_pedido, fk_id_producto, precio_unitario, cantidad, subtotal
        FROM Detalle_Carrito
        WHERE fk_id_carrito = @pk_id_carrito;

        -- 8. Actualizar el estado del carrito a Inactivo (2)
        UPDATE Carrito
        SET fk_estado = 2
        WHERE pk_id_carrito = @pk_id_carrito;

        -- 9. Registrar en el log la confirmación del carrito y pedido
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

        INSERT INTO Log (fechaHora, fk_id_usuario, entidadAfectada, operacion, detalles, resultado)
        VALUES (
            GETDATE(),
            @fk_id_usuario,
            'Pedidos',
            'INSERT',
            CONCAT('Pedido creado: ID=', @pk_id_pedido, 
                   ', Cliente ID: ', @fk_cliente, 
                   ', Total: ', @total),
            'Éxito'
        );

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        -- Obtener información del error
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();

        -- Registrar en el log el error
        INSERT INTO Log (fechaHora, fk_id_usuario, entidadAfectada, operacion, detalles, resultado)
        VALUES (
            GETDATE(),
            @fk_id_usuario,
            'Carrito',
            'UPDATE',
            @ErrorMessage,
            'Error'
        );

        -- Re-lanzar el error original
        RAISERROR (@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH

    -- Limpiar la tabla temporal si existe
    IF OBJECT_ID('tempdb..#ProductosInsuficientes') IS NOT NULL
        DROP TABLE #ProductosInsuficientes;
END;
GO
