USE MiTienditaOnlineDB;
GO

CREATE PROCEDURE CrearCarrito
    @fk_id_usuario INT,
    @fk_id_usuario_operacion INT = NULL -- Opcional, para el log
AS
BEGIN
    BEGIN TRANSACTION;

    BEGIN TRY
        DECLARE @estado INT;

        -- Verificar si ya existe un carrito pendiente (estado=3) para este usuario
        SELECT @estado = fk_estado
        FROM Carrito
        WHERE fk_id_usuario = @fk_id_usuario;

        IF @estado = 3
        BEGIN
            -- Ya existe un carrito pendiente, no creamos uno nuevo
            ROLLBACK TRANSACTION;

            -- Registrar en el log la intención fallida (opcional)
            INSERT INTO Log (fechaHora, fk_id_usuario, entidadAfectada, operacion, detalles, resultado)
            VALUES (GETDATE(), @fk_id_usuario_operacion, 'Carrito', 'INSERT',
                    CONCAT('Intento de crear nuevo carrito para usuario ID: ', @fk_id_usuario, ' cuando ya existe uno pendiente.'),
                    'Error');

            -- Lanzar un error controlado para que la capa de aplicación sepa la razón
            THROW 50000, 'Ya existe un carrito pendiente para este usuario.', 1;
        END

        -- Si no existe, crear el carrito
        INSERT INTO Carrito (fk_id_usuario, total, fk_estado)
        VALUES (@fk_id_usuario, 0, 3); -- total inicia en 0, estado pendiente (3)

        DECLARE @id_carrito INT = SCOPE_IDENTITY();

        -- Registrar la creación en el log
        INSERT INTO Log (fechaHora, fk_id_usuario, entidadAfectada, operacion, detalles, resultado)
        VALUES (
            GETDATE(), 
            @fk_id_usuario_operacion, 
            'Carrito', 
            'INSERT', 
            CONCAT('Carrito creado. ID: ', @id_carrito, ', Usuario ID: ', @fk_id_usuario), 
            'Éxito'
        );

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        -- Registrar el error en el log si se quiere (además del caso controlado)
        IF ERROR_NUMBER() <> 50000 -- Error controlado anteriormente
        BEGIN
            INSERT INTO Log (fechaHora, fk_id_usuario, entidadAfectada, operacion, detalles, resultado)
            VALUES (
                GETDATE(),
                @fk_id_usuario_operacion,
                'Carrito',
                'INSERT',
                ERROR_MESSAGE(),
                'Error'
            );
        END;
        
        THROW;
    END CATCH;
END;
