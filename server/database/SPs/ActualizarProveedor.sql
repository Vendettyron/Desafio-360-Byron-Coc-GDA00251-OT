USE MiTienditaOnlineDB;
GO
CREATE PROCEDURE ActualizarProveedor
    @pk_id_proveedor INT,
    @nombre VARCHAR(100),
    @telefono VARCHAR(8),
    @correo VARCHAR(100),
    @fk_estado INT,
    @fk_id_usuario INT = NULL  -- Parámetro opcional
AS
BEGIN
    BEGIN TRANSACTION;

    BEGIN TRY
        -- Actualizar el proveedor
        UPDATE Proveedor
        SET nombre = @nombre,
            telefono = @telefono,
            correo = @correo,
            fk_estado = @fk_estado
        WHERE pk_id_proveedor = @pk_id_proveedor;

        -- Registrar la actualización en la tabla de log
        INSERT INTO Log (fechaHora, fk_id_usuario, entidadAfectada, operacion, detalles, resultado)
        VALUES (
            GETDATE(), 
            @fk_id_usuario, 
            'Proveedor', 
            'UPDATE', 
            CONCAT('Proveedor actualizado. ID: ', @pk_id_proveedor, 
                   ', nuevo nombre: ', @nombre, 
                   ', correo: ', @correo, 
                   ', estado ID: ', @fk_estado), 
            'Éxito'
        );

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;

        -- Registrar el error en caso de fallar la actualización
        INSERT INTO Log (fechaHora, fk_id_usuario, entidadAfectada, operacion, detalles, resultado)
        VALUES (
            GETDATE(), 
            @fk_id_usuario, 
            'Proveedor', 
            'UPDATE', 
            ERROR_MESSAGE(), 
            'Error'
        );
        
        THROW; -- Lanza el error original
    END CATCH;
END;
