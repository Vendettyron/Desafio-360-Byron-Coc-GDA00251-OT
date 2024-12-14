USE MiTienditaOnlineDB;
GO

CREATE PROCEDURE InsertarProducto
    @fk_categoria INT,
    @fk_estado INT,
    @fk_proveedor INT,
    @nombre VARCHAR(100),
    @descripcion VARCHAR(MAX),
    @precio DECIMAL(10, 2),
    @stock INT,
	@fk_id_usuario INT = NULL --opcional
AS
BEGIN
    BEGIN TRANSACTION;

    BEGIN TRY
        -- Inserción del producto
        INSERT INTO Productos (fk_categoria, fk_estado, fk_proveedor, nombre, descripcion, precio, stock)
        VALUES (@fk_categoria, @fk_estado, @fk_proveedor, @nombre, @descripcion, @precio, @stock);

        -- Registro en la tabla de log
        INSERT INTO Log (fechaHora, fk_id_usuario, entidadAfectada, operacion, detalles, resultado)
        VALUES (GETDATE(), @fk_id_usuario, 'Productos', 'INSERT', 
                CONCAT('Producto insertado: ', @nombre, ', precio: ', @precio, ', stock: ', @stock), 'Éxito');

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;

        -- Registrar el error en el log
        INSERT INTO Log (fechaHora, fk_id_usuario, entidadAfectada, operacion, detalles, resultado)
        VALUES (GETDATE(), @fk_id_usuario, 'Productos', 'INSERT', ERROR_MESSAGE(), 'Error');
        
        THROW;
    END CATCH;
END;