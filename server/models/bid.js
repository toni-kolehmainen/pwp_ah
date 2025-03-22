const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../utils/db');

// class Bid extends Model { }

// Bid.init({
//   id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true
//   },
//   // auction_id: {
//   //   type: DataTypes.INTEGER,
//   //   allowNull: false,
//   //   references: { model: 'auctions', key: 'id', onDelete: 'CASCADE' },
//   // },
//   // buyer_id: {
//   //   type: DataTypes.INTEGER,
//   //   allowNull: false,
//   //   references: { model: 'users', key: 'id', onDelete: 'CASCADE' },
//   // },
//   amount: {
//     type: DataTypes.DECIMAL(10, 2),
//     allowNull: false,
//     validate: {
//       isDecimal: true,
//       min: 0
//     }
//   }
// }, {
//   sequelize,
//   underscored: true,
//   timestamps: true,
//   modelName: 'bid'
// });

// module.exports = Bid;

class Bid extends Model { }
Bid.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // buyer_id: {
  //   type: DataTypes.INTEGER,
  //   allowNull: false,
  // references: {
  //   model: 'users',
  //   key: 'id',
  //   onDelete: 'CASCADE',
  //   onUpdate: 'CASCADE'
  // }
  // },
  // auction_id: {
  // type: DataTypes.INTEGER,
  // allowNull: false,
  // references: {
  //   model: 'auctions',
  //   key: 'id',
  //   onDelete: 'CASCADE',
  //   onUpdate: 'CASCADE'
  // }
  // },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isDecimal: true,
      min: 0
    }
  }
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'bid'
});
module.exports = Bid;
