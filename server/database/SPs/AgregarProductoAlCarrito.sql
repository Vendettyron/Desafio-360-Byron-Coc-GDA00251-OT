USE MitienditaOnlineDB
GO

-- SP: AgregarProductoAlCarrito
CREATE PROCEDURE AgregarProductoAlCarrito
    @fk_id_usuario INT,
    @pk_id_producto INT,
    @cantidad INT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        DECLARE @pk_id_carrito INT;
        DECLARE @precio_unitario DECIMAL(10, 2);
        DECLARE @subtotal DECIMAL(10, 2);
        DECLARE @entidad VARCHAR(50) = 'Carrito';
        DECLARE @detalle VARCHAR(MAX);

        -- 1. Verificar si existe un carrito pendiente para el usuario
        SELECT @pk_id_carrito = pk_id_carrito
        FROM Carrito
        WHERE fk_id_usuario = @fk_id_usuario
          AND fk_estado = 3; -- Estado "Pendiente"

        IF @pk_id_carrito IS NOT NULL
        BEGIN
            SET @detalle = 'Carrito existente encontrado con pk_id_carrito = ' + CAST(@pk_id_carrito AS VARCHAR);
            INSERT INTO log (fechaHora, fk_id_usuario, entidadAfectada, operacion, detalles, resultado)
            VALUES (GETDATE(), @fk_id_usuario, @entidad, 'SELECT', @detalle, 'Éxito');
        END
        ELSE
        BEGIN
            -- 2. Si no existe, crear uno nuevo
            INSERT INTO Carrito (fk_id_usuario, fecha_creacion, total, fk_estado)
            VALUES (@fk_id_usuario, GETDATE(), 0, 3); -- Inicializar total a 0 y estado a "Pendiente"

            SET @pk_id_carrito = SCOPE_IDENTITY(); -- Obtener el ID del carrito recién creado

            SET @detalle = 'Nuevo carrito creado con pk_id_carrito = ' + CAST(@pk_id_carrito AS VARCHAR);
            INSERT INTO log (fechaHora, fk_id_usuario, entidadAfectada, operacion, detalles, resultado)
            VALUES (GETDATE(), @fk_id_usuario, @entidad, 'INSERT', @detalle, 'Éxito');
        END

        -- 3. Obtener el precio_unitario del producto
        SELECT @precio_unitario = precio
        FROM Productos
        WHERE pk_id_producto = @pk_id_producto;

        -- Verificar que el producto existe
        IF @precio_unitario IS NULL
        BEGIN
            SET @detalle = 'Producto con pk_id_producto = ' + CAST(@pk_id_producto AS VARCHAR) + ' no encontrado.';
            INSERT INTO log (fechaHora, fk_id_usuario, entidadAfectada, operacion, detalles, resultado)
            VALUES (GETDATE(), @fk_id_usuario, 'Productos', 'SELECT', @detalle, 'Error');

            RAISERROR('El producto especificado no existe.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END
        ELSE
        BEGIN
            SET @detalle = 'Precio unitario obtenido para pk_id_producto = ' + CAST(@pk_id_producto AS VARCHAR) + ' es ' + CAST(@precio_unitario AS VARCHAR);
            INSERT INTO log (fechaHora, fk_id_usuario, entidadAfectada, operacion, detalles, resultado)
            VALUES (GETDATE(), @fk_id_usuario, 'Productos', 'SELECT', @detalle, 'Éxito');
        END

        -- Calcular el subtotal
        SET @subtotal = @precio_unitario * @cantidad;

        -- 4. Verificar si el producto ya está en el carrito
        IF EXISTS (
            SELECT 1
            FROM Detalle_Carrito
            WHERE fk_id_carrito = @pk_id_carrito
              AND fk_id_producto = @pk_id_producto
        )
        BEGIN
            -- Actualizar la cantidad y el subtotal
            UPDATE Detalle_Carrito
            SET cantidad = cantidad + @cantidad,
                subtotal = (cantidad + @cantidad) * @precio_unitario
            WHERE fk_id_carrito = @pk_id_carrito
              AND fk_id_producto = @pk_id_producto;

            SET @detalle = 'Producto con pk_id_producto = ' + CAST(@pk_id_producto AS VARCHAR) + ' actualizado en Detalle_Carrito con pk_id_carrito = ' + CAST(@pk_id_carrito AS VARCHAR) + '. Nueva cantidad: ' + CAST(@cantidad AS VARCHAR);
            INSERT INTO log (fechaHora, fk_id_usuario, entidadAfectada, operacion, detalles, resultado)
            VALUES (GETDATE(), @fk_id_usuario, 'Detalle_Carrito', 'UPDATE', @detalle, 'Éxito');
        END
        ELSE
        BEGIN
            -- Insertar un nuevo detalle en el carrito
            INSERT INTO Detalle_Carrito (fk_id_carrito, fk_id_producto, precio_unitario, cantidad, subtotal)
            VALUES (@pk_id_carrito, @pk_id_producto, @precio_unitario, @cantidad, @subtotal);

            SET @detalle = 'Nuevo producto agregado al Detalle_Carrito con pk_id_producto = ' + CAST(@pk_id_producto AS VARCHAR) + ', cantidad = ' + CAST(@cantidad AS VARCHAR) + ', subtotal = ' + CAST(@subtotal AS VARCHAR);
            INSERT INTO log (fechaHora, fk_id_usuario, entidadAfectada, operacion, detalles, resultado)
            VALUES (GETDATE(), @fk_id_usuario, 'Detalle_Carrito', 'INSERT', @detalle, 'Éxito');
        END

        -- 5. Actualizar el total del carrito
        UPDATE Carrito
        SET total = (
            SELECT SUM(subtotal)
            FROM Detalle_Carrito
            WHERE fk_id_carrito = @pk_id_carrito
        )
        WHERE pk_id_carrito = @pk_id_carrito;

        SET @detalle = 'Total del carrito actualizado para pk_id_carrito = ' + CAST(@pk_id_carrito AS VARCHAR) + '. Nuevo total: ' + CAST((
            SELECT SUM(subtotal)
            FROM Detalle_Carrito
            WHERE fk_id_carrito = @pk_id_carrito
        ) AS VARCHAR);
        INSERT INTO log (fechaHora, fk_id_usuario, entidadAfectada, operacion, detalles, resultado)
        VALUES (GETDATE(), @fk_id_usuario, @entidad, 'UPDATE', @detalle, 'Éxito');

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();

        -- Registrar el error en la tabla log
        INSERT INTO log (fechaHora, fk_id_usuario, entidadAfectada, operacion, detalles, resultado)
        VALUES (GETDATE(), @fk_id_usuario, 'AgregarProductoAlCarrito', 'ERROR', @ErrorMessage, 'Error');

        RAISERROR (@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END
GO
