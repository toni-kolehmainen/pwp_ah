const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../utils/db');

class Item extends Model { }

Item.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  // sellerId: {
  //   type: DataTypes.INTEGER,
  //   allowNull: false,
  //   field: 'seller_id',
  //   references: { model: 'users', key: 'id', onDelete: 'CASCADE' }
  // },
  // categoryId: {
  //   type: DataTypes.INTEGER,
  //   allowNull: false,
  //   field: 'category_id',
  //   references: { model: 'categories', key: 'id', onDelete: 'SET NULL' }
  // }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'item'
});

module.exports = Item;
