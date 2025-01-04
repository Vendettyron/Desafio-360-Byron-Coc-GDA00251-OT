USE MiTienditaOnlineDB;
GO

CREATE PROCEDURE InactivarCategoria
    @id_categoria INT,
    @fk_id_usuario INT -- Usuario que realiza la operaci�n
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;

    BEGIN TRY
        -- Actualizar el estado de la categor�a a "Inactivo"
        UPDATE Categorias
        SET fk_estado = 2 --  2 es el estado "Inactivo"
        WHERE pk_id_categoria = @id_categoria;

        -- Verificar si la categor�a fue actualizada
        IF @@ROWCOUNT = 0
        BEGIN
            RAISERROR('No se encontr� la categor�a con el ID proporcionado.', 16, 1);
        END

        -- Actualizar el estado de los productos asociados a la categor�a a "Inactivo"
        UPDATE Productos
        SET fk_estado = 2 --  es el estado "Inactivo"
        WHERE fk_categoria = @id_categoria;

        -- Obtener el n�mero de productos afectados
        DECLARE @productos_afectados INT = @@ROWCOUNT;

        -- Registrar en Log la actualizaci�n de la categor�a
        INSERT INTO Log (fechaHora, fk_id_usuario, entidadAfectada, operacion, detalles, resultado)
        VALUES (
            GETDATE(),
            @fk_id_usuario,
            'Categorias',
            'UPDATE',
            CONCAT('Categor�a inactivada: ID=', @id_categoria),
            '�xito'
        );

        -- Registrar en Log la actualizaci�n de los productos
        INSERT INTO Log (fechaHora, fk_id_usuario, entidadAfectada, operacion, detalles, resultado)
        VALUES (
            GETDATE(),
            @fk_id_usuario,
            'Productos',
            'UPDATE',
            CONCAT('Productos inactivados: Categor�a ID=', @id_categoria, ', Total Productos Inactivados=', @productos_afectados),
            '�xito'
        );

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        -- Obtener informaci�n del error
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();

        -- Revertir la transacci�n
        ROLLBACK TRANSACTION;

        -- Registrar en Log el error al intentar inactivar la categor�a
        INSERT INTO Log (fechaHora, fk_id_usuario, entidadAfectada, operacion, detalles, resultado)
        VALUES (
            GETDATE(),
            @fk_id_usuario,
            'Categorias',
            'UPDATE',
            CONCAT('Error al inactivar la categor�a: ID=', @id_categoria, '. Error: ', @ErrorMessage),
            'Error'
        );

        -- Registrar en Log el error al intentar inactivar los productos
        INSERT INTO Log (fechaHora, fk_id_usuario, entidadAfectada, operacion, detalles, resultado)
        VALUES (
            GETDATE(),
            @fk_id_usuario,
            'Productos',
            'UPDATE',
            CONCAT('Error al inactivar productos de la categor�a: ID=', @id_categoria, '. Error: ', @ErrorMessage),
            'Error'
        );

        -- Re-lanzar el error para que la llamada al SP pueda manejarlo
        RAISERROR (@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END;
GO
