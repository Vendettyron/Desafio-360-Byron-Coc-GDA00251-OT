import { DataTypes } from 'sequelize';
import sequelize from '../config/dbSequelize.js';

const Proveedor = sequelize.define('Proveedor', {
  pk_id_proveedor: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  telefono: {
    type: DataTypes.STRING(8),
    allowNull: false,
    validate: {
      len: [8, 8],
    },
  },
  correo: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  fk_estado: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'Proveedor',
  timestamps: false,
  freezeTableName: true,
});

export default Proveedor;
