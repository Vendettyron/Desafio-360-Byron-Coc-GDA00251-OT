import sql from 'mssql';
import dotenv from 'dotenv';
dotenv.config();

const dbConfig = {
    user: process.env.DB_USER,  
    password: process.env.DB_PASSWORD, 
    server: process.env.DB_SERVER, 
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT, 10) || 1433,
    options: {
        encrypt: false, 
        trustServerCertificate: true 
    }
};

// Crear una pool de conexiones para usar en toda la aplicación
const poolPromise = new sql.ConnectionPool(dbConfig)
    .connect()
    .then(pool => {
        console.log('Conectado a la base de datos');
        return pool;
    })
    .catch(err => {
        console.error('Error de conexión: ', err);
        process.exit(1); // Termina el proceso si no puede conectar
    });

export { sql, poolPromise };








