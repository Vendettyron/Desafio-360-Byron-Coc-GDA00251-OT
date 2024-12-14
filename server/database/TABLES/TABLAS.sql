-- Usar la base de datos creada
USE MiTienditaOnlineDB;
GO

--modelo relacional de base de datos 
--https://lucid.app/lucidchart/1d5e96a9-cb84-4fa2-9e31-19b4508ba4d5/edit?viewport_loc=-3767%2C-429%2C3678%2C1806%2C0_0&invitationId=inv_cb308093-52f1-4503-95e5-ec112990db97

-- Tabla: Estados
CREATE TABLE Estados (
    pk_id_estado INT PRIMARY KEY IDENTITY(1,1),
    nombre VARCHAR(50) NOT NULL
);
-- Definicion de estados:
-- Activo = 1
-- Inactivo = 2

-- para carrito:
-- pendiente = 3
-- En proceso = 4
--  ID = 5 -- confirmado por el admin
--  ID = 6 -- cancelado por el admin
 -- ID = 7 --Pedido Cancelado por Cliente

-- para productos
-- descontinuado = 7

-- Tabla: Roles
CREATE TABLE Roles (
    pk_id_rol INT PRIMARY KEY IDENTITY(1,1),
    nombre VARCHAR(50) NOT NULL
);
-- Definicion de roles:
-- Administrador = 1
-- cliente = 2

-- Tabla: Categorías
CREATE TABLE Categorias (
    pk_id_categoria INT PRIMARY KEY IDENTITY(1,1),
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(MAX) NULL,
    fk_estado INT NOT NULL,
    FOREIGN KEY (fk_estado) REFERENCES Estados(pk_id_estado)
);


-- Tabla: Usuarios
CREATE TABLE Usuarios (
    pk_id_usuario INT PRIMARY KEY IDENTITY(1,1),
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    direccion VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    telefono VARCHAR(8) CHECK (LEN(telefono) = 8),
    password VARCHAR(60) NOT NULL,
    fk_rol INT NOT NULL,
    fk_estado INT NOT NULL,
    FOREIGN KEY (fk_rol) REFERENCES Roles(pk_id_rol),
    FOREIGN KEY (fk_estado) REFERENCES Estados(pk_id_estado)
);


-- Tabla: Proveedor
CREATE TABLE Proveedor (
    pk_id_proveedor INT PRIMARY KEY IDENTITY(1,1),
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(8) CHECK (LEN(telefono) = 8),
    correo VARCHAR(100) NOT NULL UNIQUE,
    fk_estado INT NOT NULL,
    FOREIGN KEY (fk_estado) REFERENCES Estados(pk_id_estado)
);

-- Tabla: Productos
CREATE TABLE Productos (
    pk_id_producto INT PRIMARY KEY IDENTITY(1,1),
    fk_categoria INT NOT NULL,
    fk_estado INT NOT NULL,
    fk_proveedor INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(MAX) NULL,
    precio DECIMAL(10, 2) NOT NULL CHECK (precio > 0),
    stock INT NOT NULL CHECK (stock >= 0),
    FOREIGN KEY (fk_categoria) REFERENCES Categorias(pk_id_categoria),
    FOREIGN KEY (fk_estado) REFERENCES Estados(pk_id_estado),
    FOREIGN KEY (fk_proveedor) REFERENCES Proveedor(pk_id_proveedor)
);

-- Tabla: Pedidos
CREATE TABLE Pedidos (
    pk_id_pedido INT PRIMARY KEY IDENTITY(1,1),
    fk_cliente INT NOT NULL,
    fecha_pedido DATETIME NOT NULL DEFAULT GETDATE(),
    total DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
	fk_estado INT NOT NULL,
    FOREIGN KEY (fk_cliente) REFERENCES Usuarios(pk_id_usuario),
    FOREIGN KEY (fk_estado) REFERENCES Estados(pk_id_estado)
);

-- Tabla: Detalle_Pedido
CREATE TABLE Detalle_Pedido (
    pk_id_detalle INT PRIMARY KEY IDENTITY(1,1),
    fk_id_pedido INT NOT NULL,
    fk_id_producto INT NOT NULL,
    precio_unitario DECIMAL NOT NULL,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),
    FOREIGN KEY (fk_id_pedido) REFERENCES Pedidos(pk_id_pedido),
    FOREIGN KEY (fk_id_producto) REFERENCES Productos(pk_id_producto)
);

-- Tabla: Carrito
CREATE TABLE Carrito (
    pk_id_carrito INT PRIMARY KEY IDENTITY(1,1),
    fk_id_usuario INT NOT NULL,
    fecha_creacion DATETIME DEFAULT GETDATE(),
	total DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
	fk_estado INT NOT NULL,
	FOREIGN KEY (fk_estado) REFERENCES Estados(pk_id_estado),
    FOREIGN KEY (fk_id_usuario) REFERENCES Usuarios(pk_id_usuario)
);

-- Tabla: Detalle carrito

CREATE TABLE Detalle_Carrito (
    pk_id_detalle INT PRIMARY KEY IDENTITY(1,1),
    fk_id_carrito INT NOT NULL,
    fk_id_producto INT NOT NULL,
	precio_unitario DECIMAL(10, 2) NOT NULL CHECK (precio_unitario > 0),
    cantidad INT NOT NULL CHECK (cantidad > 0),
	subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),
    FOREIGN KEY (fk_id_carrito) REFERENCES Carrito(pk_id_carrito),
    FOREIGN KEY (fk_id_producto) REFERENCES Productos(pk_id_producto)
);

-- Tabla: Log
CREATE TABLE log (
    pk_id_log INT IDENTITY(1,1) PRIMARY KEY,
    fechaHora DATETIME NOT NULL,         -- Fecha y hora del evento
    fk_id_usuario INT NULL,              -- Usuario que realizó la operación
    entidadAfectada VARCHAR(50) NOT NULL, -- Nombre de la tabla o módulo afectado
    operacion VARCHAR(20) NOT NULL,      -- Tipo de operación (INSERT, UPDATE, DELETE, etc.)
    detalles VARCHAR(MAX) NULL,                  -- Descripción detallada del evento
    resultado VARCHAR(20) NOT NULL,      -- Resultado de la operación (Éxito, Error, etc.)
    CONSTRAINT FK_Log_Usuario FOREIGN KEY (fk_id_usuario) REFERENCES Usuarios(pk_id_usuario) 
        ON DELETE SET NULL ON UPDATE CASCADE
);
