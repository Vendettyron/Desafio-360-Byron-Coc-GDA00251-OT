Use MitienditaOnlineDB
GO

CREATE PROCEDURE ObtenerPedidoPorId
    @pk_id_pedido INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        pk_id_pedido,
        fk_cliente,
        fecha_pedido,
        total,
        fk_estado
    FROM 
        Pedidos
    WHERE 
        pk_id_pedido = @pk_id_pedido;
END
