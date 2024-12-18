Use MitienditaOnlineDB
GO

CREATE PROCEDURE ObtenerProveedorPorId
    @pk_id_proveedor INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        pk_id_proveedor,
        nombre,
        telefono,
        correo,
        fk_estado,
        fecha_creacion,
        fecha_actualizacion
    FROM 
        Proveedores
    WHERE 
        pk_id_proveedor = @pk_id_proveedor;
END
