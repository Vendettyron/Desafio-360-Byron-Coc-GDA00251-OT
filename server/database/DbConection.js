import sql from 'mssql';

// Objeto con las credenciales y la configuración de la base de datos
const dbConfig = {
    user: 'userDB2',      
    password: 'root', 
    server: 'localhost',       
    database: 'MiTienditaOnlineDB', 
    options: {
        encrypt: false, 
        trustServerCertificate: true 
    }
};

// Función para conectar a la base de datos

export const getConnection = async () => {
    try {
        const pool = await sql.connect(dbConfig);

        const result = await pool.request().query('SELECT * FROM Categorias');
        console.log(result);

        return pool;
    } catch (error) {
        console.error('Error de conexión: ', error);
    }
};



