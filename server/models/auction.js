const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../utils/db')
const Sequelize = require('sequelize')

class Auction extends Model {}

Auction.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  desctription: {
    type: DataTypes.TEXT,
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
  end_time: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal("NOW() + INTERVAL '24 hours'")
  },
  starting_price: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false,
    validate: {
      min: 0.00
    }
  },
  current_price: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false,
    defaultValue: 0.00
  }
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'auction'
})

module.exports = Auction