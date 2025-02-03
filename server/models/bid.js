const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../utils/db')
class Item extends Model {}

Item.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  amount: {
    type: DataTypes.DECIMAL,
    allowNull: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'user', key: 'id' },
  },
  item_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'item', key: 'id' },
  }
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'item'
})

module.exports = User