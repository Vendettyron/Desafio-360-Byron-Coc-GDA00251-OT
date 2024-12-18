Use MitienditaOnlineDB
GO
CREATE PROCEDURE ObtenerUsuarioPorId
    @id_usuario INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        pk_id_usuario,
        nombre,
        apellido,
        direccion,
        correo,
        telefono,
        password,
        fk_rol,
        fk_estado
    FROM 
        Usuarios
    WHERE 
        pk_id_usuario = @id_usuario;
END