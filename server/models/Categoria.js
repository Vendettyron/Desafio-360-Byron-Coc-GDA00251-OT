import { DataTypes } from 'sequelize';
import sequelize from '../config/dbSequelize.js';

const Categoria = sequelize.define('Categoria', {
  pk_id_categoria: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT, // Equivalente a VARCHAR(MAX) en MSSQL
    allowNull: true,
  },
  fk_estado: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'Categorias',
  timestamps: false,
  freezeTableName: true,
});

export default Categoria;
