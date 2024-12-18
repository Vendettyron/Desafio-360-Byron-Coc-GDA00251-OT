Use MitienditaOnlineDB
GO

CREATE PROCEDURE ObtenerProductoPorId
    @pk_id_producto INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        pk_id_producto,
        fk_categoria,
        fk_estado,
        fk_proveedor,
        nombre,
        descripcion,
        precio,
        stock
    FROM 
        Productos
    WHERE 
        pk_id_producto = @pk_id_producto;
END


