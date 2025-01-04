USE MiTienditaOnlineDB;
GO

CREATE PROCEDURE InactivarCategoria
    @id_categoria INT,
    @fk_id_usuario INT -- Usuario que realiza la operación
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;

    BEGIN TRY
        -- Actualizar el estado de la categoría a "Inactivo"
        UPDATE Categorias
        SET fk_estado = 2 --  2 es el estado "Inactivo"
        WHERE pk_id_categoria = @id_categoria;

        -- Verificar si la categoría fue actualizada
        IF @@ROWCOUNT = 0
        BEGIN
            RAISERROR('No se encontró la categoría con el ID proporcionado.', 16, 1);
        END

        -- Actualizar el estado de los productos asociados a la categoría a "Inactivo"
        UPDATE Productos
        SET fk_estado = 2 --  es el estado "Inactivo"
        WHERE fk_categoria = @id_categoria;

        -- Obtener el número de productos afectados
        DECLARE @productos_afectados INT = @@ROWCOUNT;

        -- Registrar en Log la actualización de la categoría
        INSERT INTO Log (fechaHora, fk_id_usuario, entidadAfectada, operacion, detalles, resultado)
        VALUES (
            GETDATE(),
            @fk_id_usuario,
            'Categorias',
            'UPDATE',
            CONCAT('Categoría inactivada: ID=', @id_categoria),
            'Éxito'
        );

        -- Registrar en Log la actualización de los productos
        INSERT INTO Log (fechaHora, fk_id_usuario, entidadAfectada, operacion, detalles, resultado)
        VALUES (
            GETDATE(),
            @fk_id_usuario,
            'Productos',
            'UPDATE',
            CONCAT('Productos inactivados: Categoría ID=', @id_categoria, ', Total Productos Inactivados=', @productos_afectados),
            'Éxito'
        );

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        -- Obtener información del error
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();

        -- Revertir la transacción
        ROLLBACK TRANSACTION;

        -- Registrar en Log el error al intentar inactivar la categoría
        INSERT INTO Log (fechaHora, fk_id_usuario, entidadAfectada, operacion, detalles, resultado)
        VALUES (
            GETDATE(),
            @fk_id_usuario,
            'Categorias',
            'UPDATE',
            CONCAT('Error al inactivar la categoría: ID=', @id_categoria, '. Error: ', @ErrorMessage),
            'Error'
        );

        -- Registrar en Log el error al intentar inactivar los productos
        INSERT INTO Log (fechaHora, fk_id_usuario, entidadAfectada, operacion, detalles, resultado)
        VALUES (
            GETDATE(),
            @fk_id_usuario,
            'Productos',
            'UPDATE',
            CONCAT('Error al inactivar productos de la categoría: ID=', @id_categoria, '. Error: ', @ErrorMessage),
            'Error'
        );

        -- Re-lanzar el error para que la llamada al SP pueda manejarlo
        RAISERROR (@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END;
GO
