

-------------------------------------------------INSERTAR DATOS BASE-------------------------------------------
USE MiTienditaOnlineDB;
GO
-------------------------------------------------Categorias

INSERT INTO Estados (nombre) VALUES ('Activo');         -- ID = 1
INSERT INTO Estados (nombre) VALUES ('Inactivo');       -- ID = 2

-- Insertar estados para el carrito
INSERT INTO Estados (nombre) VALUES ('Pendiente');      -- ID = 3 --  cuadno el USER aun agrega productos
INSERT INTO Estados (nombre) VALUES ('En proceso');     -- ID = 4 -- cuando se confirma el carrito y pasa a un estado de rpcoeso en donde se puede cancelar aun el pedido o modificar antes que seaconfirmado por un admin
INSERT INTO Estados (nombre) VALUES ('Completado');     -- ID = 5 -- confirmado por el admin
INSERT INTO Estados (nombre) VALUES ('Pedido Cancelado por Administrador');      -- ID = 6 -- cancelado por el admin
INSERT INTO Estados (nombre) VALUES ('Pedido Cancelado por Cliente');  -- ID = 7 cancelado por el cliente
-- Insertar estado para productos descontinuados
INSERT INTO Estados (nombre) VALUES ('Producto Descontinuado');  -- ID = 8

-------------------------------------------------Roles

INSERT INTO Roles (nombre) VALUES ('Administrador');  -- ID = 1
INSERT INTO Roles (nombre) VALUES ('Usuario');        -- ID = 2

-------------------------------------------------Usuarios

INSERT INTO Usuarios (nombre, apellido, direccion, correo, telefono, password, fk_rol, fk_estado) VALUES 
('Jose', 'Perez', 'Calle Principal 123', 'jose.perez@example.com', '12345678', 'hashedpassword123', 2, 1),
('Javier', 'Estrada', 'Calle Principal 123', 'javier.perez@example.com', '12345678', 'hashedpassword123', 2, 1),
('jose', 'rodrigo', 'Calle Principal 123', 'josee.perez@example.com', '12345678', 'hashedpassword123', 2, 1),
('Geycob', 'Hernandez', 'Calle Principal 123', 'jacob.perez@example.com', '12345678', 'hashedpassword123', 2, 1),
('Byron', 'Coc', 'Calle Principal 123', 'byron.perez@example.com', '12345678', 'hashedpassword123', 1, 1);

-------------------------------------------------Categorias

INSERT INTO Categorias (nombre, descripcion, fk_estado) VALUES 
('Audio', 'Bocinas, audifonos, todo relacionado al audio', 1),
('Mouse', 'Mouse de oficina, gamer etc', 1),
('Teclado', 'Mecanico, membrana, oficina etc', 1),
('Procesadores', 'Intel o AMD', 1),
('Consolas', 'Consolas de videojuegos', 1);

-------------------------------------------------Proveedores

INSERT INTO Proveedor (nombre, telefono, correo, fk_estado) VALUES 
('Tech Supplies Inc.', '87654321', 'contact@techsupplies.com', 1),
('Sony', '12345678', 'sony@techsupplies.com', 1),
('AMD', '12345678', 'amd@techsupplies.com', 1),
('Nintendo', '12345678', 'nintendo@techsupplies.com', 1),
('Logitech', '12345678', 'logitech@techsupplies.com', 1),
('Razer', '12345678', 'razer@techsupplies.com', 1),
('Intel Corp.', '12345678', 'itel@techsupplies.com', 1);

-------------------------------------------------Productos

INSERT INTO Productos (fk_categoria, fk_estado, fk_proveedor, nombre, descripcion, precio, stock) VALUES 
(1, 1, 2, 'Audífonos Sony WH-1000XM5', 'Audífonos inalámbricos con cancelación de ruido', 3000.00, 50),
(1, 1, 5, 'Bocinas Logitech Z906', 'Sistema de bocinas 5.1 con certificación THX', 2500.00, 30),
(3, 1, 5, 'Teclado Logitech G915', 'Teclado mecánico inalámbrico con iluminación RGB', 2800.00, 20),
(3, 1, 6, 'Razer Huntsman V2 Analog', 'Teclado mecánico analógico con switches ópticos', 3000.00, 15),
(4, 1, 3, 'AMD Ryzen 9 7950X', 'Procesador de alto rendimiento con 16 núcleos', 7000.00, 10),
(4, 1, 7, 'Intel Core i9-13900K', 'Procesador de alto rendimiento con 24 núcleos', 7500.00, 12),
(5, 1, 4, 'Nintendo Switch OLED', 'Consola portátil con pantalla OLED mejorada', 3500.00, 25),
(5, 1, 2, 'Sony PlayStation 5', 'Consola de nueva generación con soporte 4K', 8500.00, 20);

-------------------------------------------------Pedidos

INSERT INTO Pedidos (fk_cliente, fk_estado, fecha_pedido, total) VALUES 
(1, 4, GETDATE(), 15000.00),
(2, 4, '2024-08-02 14:30:00', 1200.00), 
(3, 4, '2024-08-03 16:45:00', 3200.00), 
(4, 5, '2024-08-05 12:00:00', 4500.00); 

-------------------------------------------------Detalle Pedido

INSERT INTO Detalle_Pedido (fk_id_pedido, fk_id_producto, precio_unitario, cantidad, subtotal) 
VALUES 
(1, 1, 3000.00, 2, 6000.00), 
(2, 5, 1200.00, 1, 1200.00), 
(3, 2, 3500.00, 1, 3500.00), 
(4, 7, 7000.00, 1, 7000.00); 

-------------------------------------------------Carrito

INSERT INTO Carrito (fk_id_usuario, fecha_creacion, total, fk_estado) 
VALUES 
(1, '2024-08-01 09:00:00', 8500.00, 3), 
(2, '2024-08-02 13:00:00', 1800.00, 3), 
(3, '2024-08-03 15:30:00', 2800.00, 3), 
(4, '2024-08-04 17:45:00', 8500.00, 3); 


-------------------------------------------------Detalle carrito

INSERT INTO Detalle_Carrito (fk_id_carrito, fk_id_producto, cantidad, precio_unitario, subtotal) 
VALUES 
(4, 2, 1, 8500.00, 8500.00),
(5, 4, 1, 1800.00, 1800.00), 
(6, 6, 1, 2800.00, 2800.00), 
(7, 8, 1, 8500.00, 8500.00); 
