const { faker } = require('@faker-js/faker');
const { Auction, Item } = require('../models');
const { sequelize } = require('../utils/db');

// Generate random auctions
const generateRandomAuction = (items) => {
  const auctions = [];

  const oneMinuteAgo = new Date(Date.now() + 60 * 1000);
  const start_time = new Date(oneMinuteAgo - 24 * 60 * 60 * 1000);
  console.log(oneMinuteAgo.toISOString());
  const price = parseFloat(faker.commerce.price({ min: 10, max: 1000 }));
  auctions.push({
    description: faker.commerce.productDescription(),
    start_time: start_time.toISOString(),
    end_time: oneMinuteAgo.toISOString(),
    starting_price: price,
    current_price: price,
    item_id: items.id,
    seller_id: items.seller_id
  });

  return auctions;
};

// Seed the database
const createAuction = async () => {
  try {
    await sequelize.sync();
    const items = await Item.findAll();
    const plainItems = items.map((item) => item.get({ plain: true }));
    const item = plainItems[plainItems.length - 1];

    // Create auction
    const auctions = await Auction.bulkCreate(generateRandomAuction(item), { returning: true });
    console.log('✅ Auction created');

    console.log('✅ Data seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
  }
};

// Run the script
createAuction();
