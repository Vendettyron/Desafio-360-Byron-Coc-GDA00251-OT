USE MiTienditaOnlineDB;
GO

CREATE PROCEDURE InsertarProveedor
    @nombre NVARCHAR(100),
    @telefono NVARCHAR(8),
    @correo NVARCHAR(100),
    @fk_estado INT,
    @fk_id_usuario INT = NULL -- Usuario que realiza la operación (opcional para registro en log)
AS
BEGIN
    BEGIN TRANSACTION;
    BEGIN TRY
        -- Insertar el proveedor en la tabla Proveedor
        INSERT INTO Proveedor (nombre, telefono, correo, fk_estado)
        VALUES (@nombre, @telefono, @correo, @fk_estado);

        -- Obtener el ID del proveedor recién insertado
        DECLARE @id_proveedor INT;
        SET @id_proveedor = SCOPE_IDENTITY();

        -- Registrar la operación en la tabla Log
        INSERT INTO Log (fechaHora, fk_id_usuario, entidadAfectada, operacion, detalles, resultado)
        VALUES (
            GETDATE(),
            @fk_id_usuario,
            'Proveedor',
            'INSERT',
            CONCAT('Proveedor creado: ID=', @id_proveedor, ', Nombre=', @nombre, ', Teléfono=', @telefono, ', Correo=', @correo, ', Estado=', @fk_estado),
            'Éxito'
        );

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        -- En caso de error, deshacer la transacción y registrar el error en Log
        ROLLBACK TRANSACTION;

        INSERT INTO Log (fechaHora, fk_id_usuario, entidadAfectada, operacion, detalles, resultado)
        VALUES (
            GETDATE(),
            @fk_id_usuario,
            'Proveedor',
            'INSERT',
            ERROR_MESSAGE(),
            'Error'
        );

        THROW;
    END CATCH;
END;
