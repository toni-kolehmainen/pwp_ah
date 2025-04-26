const { NODE_ENV } = require('../utils/config');
const User = require('./user');
const Item = require('./item');
const Category = require('./category');
const Auction = require('./auction');
const Bid = require('./bid');

// Define relationships
User.hasMany(Item, {
  foreignKey: {
    name: 'seller_id',
    allowNull: false
  }
});
Item.belongsTo(User, {
  foreignKey: {
    name: 'seller_id',
    allowNull: false
  }
});

// User.hasMany(Auction);
// Auction.belongsTo(User);

Category.hasMany(Item, {
  onDelete: 'SET NULL',
  foreignKey: {
    name: 'category_id',
    allowNull: false
  }
});

Item.belongsTo(Category, {
  foreignKey: {
    name: 'category_id',
    allowNull: false
  }
});

Item.hasOne(Auction);
Auction.belongsTo(Item);

User.hasMany(Bid, {
  foreignKey: {
    name: 'buyer_id',
    allowNull: false
  }
});
Bid.belongsTo(User, {
  foreignKey: {
    name: 'buyer_id',
    allowNull: false
  }
});

Auction.hasMany(Bid, {
  foreignKey: {
    name: 'auction_id',
    allowNull: false
  }
});
Bid.belongsTo(Auction, {
  foreignKey: {
    name: 'auction_id',
    allowNull: false
  }
});

// Sync models
const dbSync = async () => {
  try {
    await User.sync({ alter: true });
    await Category.sync({ alter: true });
    await Item.sync({ alter: true });
    await Auction.sync({ alter: true });
    await Bid.sync({ alter: true });

    console.log('All tables synchronized!');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
};

if (NODE_ENV !== 'test') {
  dbSync();
}

module.exports = {
  dbSync,
  User,
  Item,
  Category,
  Auction,
  Bid
};
