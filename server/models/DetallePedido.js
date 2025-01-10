import { DataTypes } from 'sequelize';
import sequelize from '../config/dbSequelize.js';

const DetallePedido = sequelize.define('Detalle_Pedido', {
  pk_id_detalle: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fk_id_pedido: {
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
  tableName: 'Detalle_Pedido',
  timestamps: false,
  freezeTableName: true,
});

export default DetallePedido;
