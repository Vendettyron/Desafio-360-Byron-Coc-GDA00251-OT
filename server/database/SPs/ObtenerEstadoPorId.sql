Use MiTienditaOnlineDB
GO

CREATE PROCEDURE ObtenerEstadoPorId
	@pk_id_estado INT
AS
BEGIN

	SET NOCOUNT ON;
	SELECT 

	pk_id_estado,
	nombre

	FROM
		Estados
	WHERE 
		pk_id_estado = @pk_id_estado;

END

	
