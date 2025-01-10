import { DataTypes } from 'sequelize';
import sequelize from '../config/dbSequelize.js';

const Usuario = sequelize.define('Usuario', {
  pk_id_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  apellido: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  direccion: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  correo: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  telefono: {
    type: DataTypes.STRING(8),
    allowNull: false,
    validate: {
      len: [8, 8], // 8 dígitos exactos
    },
  },
  password: {
    type: DataTypes.STRING(60),
    allowNull: false,
  },
  fk_rol: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fk_estado: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'Usuarios',
  timestamps: false,
  freezeTableName: true,
});

export default Usuario;
