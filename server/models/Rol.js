import { DataTypes } from 'sequelize';
import sequelize from '../config/dbSequelize.js';

const Rol = sequelize.define('Rol', {
  pk_id_rol: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
}, {
  tableName: 'Roles',
  timestamps: false,
  freezeTableName: true,
});

export default Rol;
