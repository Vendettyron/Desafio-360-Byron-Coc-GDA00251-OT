Use MitienditaOnlineDB
GO

CREATE PROCEDURE ObtenerCarritoPorId
    @pk_id_carrito INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        pk_id_carrito,
        fk_id_usuario,
        fecha_creacion,
        total,
        fk_estado
    FROM 
        Carrito
    WHERE 
        pk_id_carrito = @pk_id_carrito;
END

