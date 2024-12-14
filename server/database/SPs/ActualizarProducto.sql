USE MiTienditaOnlineDB;
GO

CREATE PROCEDURE ActualizarProducto
    @id_producto INT,
    @fk_categoria INT,        
    @fk_proveedor INT,       
    @nombre NVARCHAR(100),
    @descripcion NVARCHAR(MAX),
    @precio DECIMAL(10, 2),
    @stock INT,
    @fk_estado INT,
    @fk_id_usuario INT        -- Usuario que realiza la operación
AS
BEGIN
    BEGIN TRANSACTION;
    BEGIN TRY
        -- Verificar que el producto exista
        IF NOT EXISTS (SELECT 1 FROM Productos WHERE pk_id_producto = @id_producto)
        BEGIN
            ROLLBACK TRANSACTION;
            THROW 50000, 'El producto especificado no existe.', 1;
        END

        -- Verificar que la categoría exista y esté activa
        IF NOT EXISTS (SELECT 1 FROM Categorias WHERE pk_id_categoria = @fk_categoria AND fk_estado = 1)
        BEGIN
            ROLLBACK TRANSACTION;
            THROW 50001, 'La categoría especificada no existe o no está activa.', 1;
        END

        -- Verificar que el proveedor exista y esté activo
        IF NOT EXISTS (SELECT 1 FROM Proveedor WHERE pk_id_proveedor = @fk_proveedor AND fk_estado = 1)
        BEGIN
            ROLLBACK TRANSACTION;
            THROW 50002, 'El proveedor especificado no existe o no está activo.', 1;
        END

        -- Actualizar los datos del producto, incluyendo categoría y proveedor
        UPDATE Productos
        SET 
            fk_categoria = @fk_categoria,
            fk_proveedor = @fk_proveedor,
            nombre = @nombre,
            descripcion = @descripcion,
            precio = @precio,
            stock = @stock,
            fk_estado = @fk_estado
        WHERE pk_id_producto = @id_producto;

        -- Registrar en Log
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
            'Productos',
            'UPDATE',
            CONCAT(
                'Producto actualizado: ID=', @id_producto, 
                ', Categoría ID=', @fk_categoria, 
                ', Proveedor ID=', @fk_proveedor,
                ', Nombre=', @nombre, 
                ', Precio=', @precio, 
                ', Stock=', @stock
            ),
            'Éxito'
        );

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        -- Registrar el error en el log
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
            'Productos',
            'UPDATE',
            ERROR_MESSAGE(),
            'Error'
        );

        THROW;
    END CATCH;
END;
GO
