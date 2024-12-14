import { getConnection } from "../database/DbConection.js";
import  sql  from "mssql";

export const getProducts = async (req, res) => {
    const pool = await getConnection();
    const result = await pool.request().query('SELECT * FROM Productos');
    res.json(result.recordset);
};

export const getIdProducts = async (req, res) => {
    const pool = await getConnection();
    const { id } = req.params;
    const result = await pool.request().input('id', id).query('SELECT * FROM Productos WHERE id = @id');
    res.json(result.recordset);
}

// export const postProducts = async (req, res) => {
//     try {
//         const { nombre, descripcion, precio, stock, fk_categoria, fk_estado, fk_proveedor } = req.body;

//         const pool = await getConnection();
//         await pool.request()
//             .input('fk_categoria', sql.Int, fk_categoria)
//             .input('fk_estado', sql.Int, fk_estado)
//             .input('fk_proveedor', sql.Int, fk_proveedor)
//             .input('nombre', sql.VarChar(100), nombre)
//             .input('descripcion', sql.VarChar(sql.MAX), descripcion) // si antes usabas TEXT, aquí puedes usar VarChar(MAX)
//             .input('precio', sql.Decimal(10,2), precio)
//             .input('stock', sql.Int, stock)
//             .query(`INSERT INTO Productos (fk_categoria, fk_estado, fk_proveedor, nombre, descripcion, precio, stock)
//                     VALUES (@fk_categoria, @fk_estado, @fk_proveedor, @nombre, @descripcion, @precio, @stock);`);

//         res.json({ message: 'Producto insertado exitosamente' });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error al insertar el producto' });
//     }
// };

export const postProducts = async (req, res) => {
    try {
        // Extraer datos del cuerpo de la petición
        const { nombre, descripcion, precio, stock, fk_categoria, fk_estado, fk_proveedor } = req.body;

        // Obtener la conexión al pool
        const pool = await getConnection();

        // Ejecutar el procedimiento almacenado con los parámetros adecuados
        await pool.request()
        .input('fk_categoria', sql.Int, fk_categoria)
        .input('fk_estado', sql.Int, fk_estado)
        .input('fk_proveedor', sql.Int, fk_proveedor)
        .input('nombre', sql.VarChar(100), nombre)
        .input('descripcion', sql.VarChar(sql.MAX), descripcion)
        .input('precio', sql.Decimal(10,2), precio)
        .input('stock', sql.Int, stock)
        .execute('InsertarProducto');

        // Responder al cliente una vez insertado el producto
        res.json({ message: 'Producto insertado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al insertar el producto' });
    }
};

export const putProducts = (req, res) => {
    res.send("actualizando un solo producto");
}
export const deleteProducts = (req, res) => {
    res.send("eliminando un producto");
  }