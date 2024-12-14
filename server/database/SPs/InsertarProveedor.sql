USE MiTienditaOnlineDB;
GO

CREATE PROCEDURE InsertarProveedor
    @nombre NVARCHAR(100),
    @telefono NVARCHAR(8),
    @correo NVARCHAR(100),
    @fk_estado INT,
    @fk_id_usuario INT = NULL -- Usuario que realiza la operaci�n (opcional para registro en log)
AS
BEGIN
    BEGIN TRANSACTION;
    BEGIN TRY
        -- Insertar el proveedor en la tabla Proveedor
        INSERT INTO Proveedor (nombre, telefono, correo, fk_estado)
        VALUES (@nombre, @telefono, @correo, @fk_estado);

        -- Obtener el ID del proveedor reci�n insertado
        DECLARE @id_proveedor INT;
        SET @id_proveedor = SCOPE_IDENTITY();

        -- Registrar la operaci�n en la tabla Log
        INSERT INTO Log (fechaHora, fk_id_usuario, entidadAfectada, operacion, detalles, resultado)
        VALUES (
            GETDATE(),
            @fk_id_usuario,
            'Proveedor',
            'INSERT',
            CONCAT('Proveedor creado: ID=', @id_proveedor, ', Nombre=', @nombre, ', Tel�fono=', @telefono, ', Correo=', @correo, ', Estado=', @fk_estado),
            '�xito'
        );

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        -- En caso de error, deshacer la transacci�n y registrar el error en Log
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
