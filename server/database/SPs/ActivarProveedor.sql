USE MiTienditaOnlineDB;
GO
CREATE PROCEDURE ActivarProveedor
    @pk_id_proveedor INT,
    @id_usuario_accion INT
AS
BEGIN
    BEGIN TRY
        -- Actualizar estado del proveedor a Activo
        UPDATE Proveedor
        SET fk_estado = 1
        WHERE pk_id_proveedor = @pk_id_proveedor;

        -- Registrar en el log
        INSERT INTO log (fechaHora, fk_id_usuario, entidadAfectada, operacion, detalles, resultado)
        VALUES (
            GETDATE(),
            @id_usuario_accion,
            'Proveedor',
            'ACTIVACIÓN',
            CONCAT('El proveedor con ID ', @pk_id_proveedor, ' fue activado.'),
            'Éxito'
        );
    END TRY
    BEGIN CATCH
        -- Manejo de errores y registro en el log
        INSERT INTO log (fechaHora, fk_id_usuario, entidadAfectada, operacion, detalles, resultado)
        VALUES (
            GETDATE(),
            @id_usuario_accion,
            'Proveedor',
            'ACTIVACIÓN',
            ERROR_MESSAGE(),
            'Error'
        );
    END CATCH
END;
