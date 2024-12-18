Use MitienditaOnlineDB
GO
CREATE PROCEDURE ObtenerCategoriaPorId
    @pk_id_categoria INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        pk_id_categoria,
        nombre,
        descripcion,
        fk_estado
    FROM 
        Categorias
    WHERE 
        pk_id_categoria = @pk_id_categoria;
END