import { DataTypes } from 'sequelize';
import sequelize from '../config/dbSequelize.js';

const Log = sequelize.define('log', {
  pk_id_log: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fechaHora: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  fk_id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  entidadAfectada: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  operacion: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  detalles: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  resultado: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
}, {
  tableName: 'log',
  timestamps: false,
  freezeTableName: true,
});

export default Log;
