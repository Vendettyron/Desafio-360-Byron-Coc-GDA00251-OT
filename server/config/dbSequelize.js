// server/config/dbSequelize.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config(); 

const {
  DB_USER,
  DB_PASSWORD,
  DB_SERVER,
  DB_PORT,
  DB_DATABASE
} = process.env; 


const sequelize = new Sequelize(DB_DATABASE, DB_USER, DB_PASSWORD, {
  host: DB_SERVER,
  port: DB_PORT, 
  dialect: 'mssql',
  dialectOptions: {
    options: {
      
      trustServerCertificate: true,
     
    }
  },
  logging: false, 
});

// Probar la conexión una sola vez
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión establecida con MSSQL mediante Sequelize.');
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error);
  }
})();

export default sequelize;
