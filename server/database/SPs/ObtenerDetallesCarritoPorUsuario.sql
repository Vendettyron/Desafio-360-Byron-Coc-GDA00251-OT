USE MitienditaOnlineDB
GO

-- SP: ObtenerDetallesCarritoPorUsuario
CREATE PROCEDURE ObtenerDetallesCarritoPorUsuario
    @fk_id_usuario INT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        -- Declaración de variables
        DECLARE @pk_id_carrito INT;
        DECLARE @total DECIMAL(10, 2);
        DECLARE @fecha_creacion DATETIME;

        -- 1. Verificar si existe un carrito pendiente para el usuario
        SELECT 
            @pk_id_carrito = pk_id_carrito,
            @total = total,
            @fecha_creacion = fecha_creacion
        FROM Carrito
        WHERE fk_id_usuario = @fk_id_usuario
          AND fk_estado = 3; -- Estado "Pendiente"

        -- 2. Si no existe, retornar mensaje de carrito vacío
        IF @pk_id_carrito IS NULL
        BEGIN
            SELECT 
                pk_id_carrito = NULL,
                fecha_creacion = NULL,
                total = 0.00,
                mensaje = 'No existe un carrito pendiente para este usuario.'
            ;
            RETURN;
        END

        -- 3. Recuperar detalles del carrito en un único conjunto de resultados
        SELECT 
            C.pk_id_carrito,
            C.fecha_creacion,
            C.total,
            DC.pk_id_detalle,
            DC.fk_id_producto,
            P.nombre AS nombre_producto,
            DC.precio_unitario,
            DC.cantidad,
            DC.subtotal
        FROM Carrito C
        INNER JOIN Detalle_Carrito DC ON C.pk_id_carrito = DC.fk_id_carrito
        INNER JOIN Productos P ON DC.fk_id_producto = P.pk_id_producto
        WHERE C.pk_id_carrito = @pk_id_carrito;

    END TRY
    BEGIN CATCH
        -- Manejo de errores
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();

        RAISERROR (@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END
GO
