Use MiTienditaOnlineDB
GO

CREATE PROCEDURE ObtenerPedidosSegunTipo
    @fk_estado INT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        -- Selecciona los pedidos filtrados por fk_estado
        SELECT 
            p.pk_id_pedido,
            p.fk_cliente,
            u.nombre AS NombreCliente,
            p.fecha_pedido,
            p.total,
            p.fk_estado,
            e.nombre AS NombreEstado
        FROM 
            Pedidos p
            INNER JOIN Usuarios u ON p.fk_cliente = u.pk_id_usuario
            INNER JOIN Estados e ON p.fk_estado = e.pk_id_estado
        WHERE 
            p.fk_estado = @fk_estado
        ORDER BY 
            p.fecha_pedido DESC; -- Ordena los resultados por fecha de pedido descendente
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

        -- Lanza el error al nivel de aplicación
        RAISERROR (@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END
