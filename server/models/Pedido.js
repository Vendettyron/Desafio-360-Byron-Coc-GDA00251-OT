import { DataTypes } from 'sequelize';
import sequelize from '../config/dbSequelize.js';

const Pedido = sequelize.define('Pedido', {
  pk_id_pedido: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fk_cliente: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fecha_pedido: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  fk_estado: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'Pedidos',
  timestamps: false,
  freezeTableName: true,
});

export default Pedido;
