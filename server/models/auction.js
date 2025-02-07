const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../utils/db')

class Auction extends Model {}

Auction.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  desctription: {
    type: DataTypes.DECIMAL,
    allowNull: true
  },
  // item_id: {
  //   type: DataTypes.INTEGER,
  //   allowNull: false,
  //   references: { model: 'items', key: 'id', onDelete: 'CASCADE' },
  // },
  // seller_id: {
  //   type: DataTypes.INTEGER,
  //   allowNull: false,
  //   references: { model: 'users', key: 'id', onDelete: 'CASCADE' },
  // },
  starting_price: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  },
  current_price: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  }
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'auction'
})

module.exports = Auction