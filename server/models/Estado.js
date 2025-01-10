import { DataTypes } from 'sequelize';
import sequelize from '../config/dbSequelize.js';

const Estado = sequelize.define('Estado', {
  pk_id_estado: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
}, {
  tableName: 'Estados',
  timestamps: false,
  freezeTableName: true,
});

export default Estado;
