const { Model, DataTypes } = require('sequelize');
const Sequelize = require('sequelize');
const { sequelize } = require('../utils/db');
const Item = require('./item'); // Import the Item model
const User = require('./user'); // Import the User model

class Auction extends Model {}
Auction.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    item_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'items', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    seller_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('NOW() + INTERVAL \'24 hours\'')
    },
    starting_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: true,
        min: 0.00
      }
    },
    current_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    }
  },
  {
    sequelize,
    modelName: 'auction',
    timestamps: true,
    underscored: true
  }
);

// Relationships
Auction.belongsTo(Item, { foreignKey: 'item_id', as: 'item' });
Auction.belongsTo(User, { foreignKey: 'seller_id', as: 'seller' });

module.exports = Auction;
