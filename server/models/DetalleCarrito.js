import { DataTypes } from 'sequelize';
import sequelize from '../config/dbSequelize.js';

const DetalleCarrito = sequelize.define('Detalle_Carrito', {
  pk_id_detalle: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fk_id_carrito: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fk_id_producto: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  precio_unitario: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
    },
  },
  subtotal: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false,
    validate: {
      min: 0,
    },
  },
}, {
  tableName: 'Detalle_Carrito',
  timestamps: false,
  freezeTableName: true,
});

export default DetalleCarrito;
