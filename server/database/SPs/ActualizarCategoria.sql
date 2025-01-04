USE MiTienditaOnlineDB;
GO

CREATE PROCEDURE ActualizarCategoria
    @id_categoria INT,
    @nombre NVARCHAR(100),
    @descripcion NVARCHAR(MAX),
    @fk_estado INT,
    @fk_id_usuario INT -- Usuario que realiza la operación
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRANSACTION;

    BEGIN TRY
        -- 1. Actualizar los datos de la categoría
        UPDATE Categorias
        SET nombre = @nombre,
            descripcion = @descripcion,
            fk_estado = @fk_estado
        WHERE pk_id_categoria = @id_categoria;

        -- Verificar si la actualización afectó alguna fila
        IF @@ROWCOUNT = 0
        BEGIN
            RAISERROR('No se encontró la categoría con ID %d.', 16, 1, @id_categoria);
        END

        -- 2. Registrar en Log la actualización de la categoría
        INSERT INTO Log (fechaHora, fk_id_usuario, entidadAfectada, operacion, detalles, resultado)
        VALUES (
            GETDATE(),
            @fk_id_usuario,
            'Categorias',
            'UPDATE',
            CONCAT('Categoría actualizada: ID=', @id_categoria, ', Nombre=', @nombre, ', Estado=', @fk_estado),
            'Éxito'
        );

        -- 3. Si el nuevo estado es 2 (Inactivo), inactivar productos relacionados
        IF @fk_estado = 2
        BEGIN
            -- Inactivar productos asociados a la categoría
            UPDATE Productos
            SET fk_estado = 2
            WHERE fk_categoria = @id_categoria AND fk_estado <> 2;

            -- Capturar el número de productos inactivados
            DECLARE @productosInactivados INT = @@ROWCOUNT;

            -- 4. Registrar en Log la inactivación de productos
            INSERT INTO Log (fechaHora, fk_id_usuario, entidadAfectada, operacion, detalles, resultado)
            VALUES (
                GETDATE(),
                @fk_id_usuario,
                'Productos',
                'UPDATE',
                CONCAT('Productos inactivados para Categoría ID=', @id_categoria, '. Total inactivados: ', @productosInactivados),
                'Éxito'
            );
        END

        -- 5. Confirmar la transacción
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        -- 6. Revertir la transacción en caso de error
        ROLLBACK TRANSACTION;

        -- Capturar información del error
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();

        -- 7. Registrar en Log el error
        INSERT INTO Log (fechaHora, fk_id_usuario, entidadAfectada, operacion, detalles, resultado)
        VALUES (
            GETDATE(),
            @fk_id_usuario,
            'Categorias',
            'UPDATE',
            @ErrorMessage,
            'Error'
        );

        -- 8. Re-lanzar el error
        RAISERROR (@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END;
GO