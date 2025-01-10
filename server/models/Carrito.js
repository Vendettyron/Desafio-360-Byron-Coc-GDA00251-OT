import { DataTypes } from 'sequelize';
import sequelize from '../config/dbSequelize.js';

const Carrito = sequelize.define('Carrito', {
  pk_id_carrito: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fk_id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
  total: {
    type: DataTypes.DECIMAL(10,2),
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
  tableName: 'Carrito',
  timestamps: false,
  freezeTableName: true,
});

export default Carrito;
