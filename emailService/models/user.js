const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../utils/db');

class User extends Model { }

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  nickname: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  password: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'user'
});

module.exports = User;
