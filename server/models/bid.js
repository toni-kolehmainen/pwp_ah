const { Model, DataTypes, Sequelize } = require('sequelize');
const { sequelize } = require('../utils/db');

class Bid extends Model { }
Bid.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isDecimal: true,
      min: 0
    }
  },
  buy_time: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('NOW()')
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'bid'
});
module.exports = Bid;
