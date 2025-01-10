import { DataTypes } from 'sequelize';
import sequelize from '../config/dbSequelize.js';

const Producto = sequelize.define('Producto', {
  pk_id_producto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fk_categoria: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fk_estado: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fk_proveedor: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0.01,
    },
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
    },
  },
}, {
  tableName: 'Productos',
  timestamps: false,
  freezeTableName: true,
});

export default Producto;
