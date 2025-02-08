const User = require('./user')
const Item = require('./item')
const Category = require('./category')
const Auction = require('./auction')
const Bid = require('./bid')

// Define relationships
User.hasMany(Item)
Item.belongsTo(User)

User.hasMany(Auction)
Auction.belongsTo(User)

Category.hasMany(Item, { onDelete: 'SET NULL' })
Item.belongsTo(Category)

Item.hasOne(Auction)
Auction.belongsTo(Item)

User.hasMany(Bid)
Bid.belongsTo(User)

Auction.hasMany(Bid)
Bid.belongsTo(Auction)

// Item.belongsTo(User, { foreignKey: 'seller_id' })
// User.hasMany(Item, { foreignKey: 'seller_id' })

// Auction.belongsTo(User, { foreignKey: 'seller_id' })
// User.hasMany(Auction, { foreignKey: 'seller_id' })

// Item.belongsTo(Category, { foreignKey: 'category_id' })
// Category.hasMany(Item, { foreignKey: 'category_id' }, { onDelete: 'SET NULL' })

// Auction.belongsTo(Item, { foreignKey: 'item_id' })
// Item.hasOne(Auction, { foreignKey: 'item_id' })

// Bid.belongsTo(User, { foreignKey: 'buyer_id' })
// User.hasMany(Bid, { foreignKey: 'buyer_id' })

// Bid.belongsTo(Auction, { foreignKey: 'auction_id' })
// Auction.hasMany(Bid, { foreignKey: 'auction_id' })

// Sync models
const dbSync = async () => {
  try {
      await User.sync({ alter: true });
      await Category.sync({ alter: true });
      await Auction.sync({ alter: true });
      await Item.sync({ alter: true });
      await Bid.sync({ alter: true });

      console.log("All tables synchronized!");
  } catch (error) {
      console.error("Error syncing database:", error);
  }
};

dbSync()

module.exports = {
  User, Item, Category, Auction, Bid
}