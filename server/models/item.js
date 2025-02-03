const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../utils/db')
class Item extends Model {}

Item.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  starting_price: {
    type: DataTypes.DECIMAL,
    allowNull: true
  },
  current_price: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  seller_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    // references: { model: 'seller', key: 'id' },
  },
  end_time: {
    type: DataTypes.DATE,
    allowNull: false
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'item'
})

module.exports = User