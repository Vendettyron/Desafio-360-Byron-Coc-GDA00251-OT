# MiTienditaOnline Backend

**MiTienditaOnline**Este README proporciona una visión general de la estructura del proyecto, las tecnologías utilizadas y cómo está organizado el backend.

## Tabla de Contenidos

- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Estructura del Proyecto](#estructura-del-proyecto)
  - [Controllers](#controllers)
  - [Database](#database)
    - [Stored Procedures (SPs)](#stored-procedures-sps)
    - [Tables](#tables)
    - [Connection](#connection)
  - [Middleware](#middleware)
  - [Routes](#routes)
  - [Services](#services)
- [Configuración Inicial](#configuración-inicial)
- [Ejecutar la Aplicación](#ejecutar-la-aplicación)
- [Contribuciones](#contribuciones)
- [Licencia](#licencia)

## Tecnologías Utilizadas

- **Node.js**: Entorno de ejecución para JavaScript en el servidor.
- **Express.js**: Framework minimalista para aplicaciones web en Node.js.
- **SQL Server**: Sistema de gestión de bases de datos relacional.
- **JWT (JSON Web Tokens)**: Para autenticación y autorización segura.
- **Postman**: Para pruebas y documentación de APIs.

## Estructura del Proyecto

El proyecto está organizado en varias carpetas principales, cada una con una responsabilidad específica para mantener el código modular y fácil de mantener.

### Controllers

**Ubicación:** `/controllers`

**Descripción:** Manejan la lógica de negocio y procesan las solicitudes entrantes, actuando como intermediarios entre las rutas y los servicios.

**Ejemplo de archivo:** `pedidoController.js`

### Database

**Ubicación:** `/database`

**Descripción:** Contiene todos los recursos relacionados con la base de datos, incluyendo procedimientos almacenados, scripts de creación de tablas y la configuración de la conexión.

#### Stored Procedures (SPs)

**Ubicación:** `/database/SPs`

**Descripción:** Los SPs encapsulan operaciones de la base de datos

**Ejemplo de archivo:** `InsertarDetallePedido.sql`

#### Tables

**Ubicación:** `/database/tables`

**Descripción:** Contiene scripts SQL para la **creación de la base de datos** y la **inserción de datos base**.

**Ejemplo de archivo:** `create DATA BASE.sql`

### Middleware

**Ubicación:** `/middleware`

**Descripción:** = Se utilizan para tareas como la autenticación De usuario y admin por medio de JWT

**Ejemplo de archivo:** `authMiddleware.js`

### Routes

**Ubicación:** `/routes`

**Descripción:** Define los puntos finales de la API y asocia cada ruta con su respectivo controlador. Organizar las rutas de manera clara facilita la navegación y el mantenimiento del código.

**Ejemplo de archivo:** `pedido.routes.js`

### Services

**Ubicación:** `/services`

**Descripción:** Contienen la lógica de negocio más detallada y se comunican directamente con la base de datos a través de los procedimientos almacenados.
 Esta capa separa la lógica de negocio de los controladores.

**Ejemplo de archivo:** `pedidoService.js`
