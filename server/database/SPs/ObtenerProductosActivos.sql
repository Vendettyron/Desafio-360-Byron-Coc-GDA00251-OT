USE MiTienditaOnlineDB;
GO

-- Verificar si el Stored Procedure ya existe y eliminarlo
IF OBJECT_ID('dbo.ObtenerProductosActivos', 'P') IS NOT NULL
    DROP PROCEDURE ObtenerProductosActivos;
GO

CREATE PROCEDURE ObtenerProductosActivos
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        SELECT productos.*
        FROM Productos productos
        INNER JOIN Estados estados ON productos.fk_estado = estados.pk_id_estado
        WHERE estados.nombre = 'Activo';
    END TRY
    BEGIN CATCH
        -- Manejo de errores
        DECLARE @ErrorMessage NVARCHAR(4000);
        DECLARE @ErrorSeverity INT;
        DECLARE @ErrorState INT;

        SELECT 
            @ErrorMessage = ERROR_MESSAGE(),
            @ErrorSeverity = ERROR_SEVERITY(),
            @ErrorState = ERROR_STATE();

        RAISERROR (@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END;
GO

