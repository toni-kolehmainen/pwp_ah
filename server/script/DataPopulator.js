const { faker } = require('@faker-js/faker');
const {
  User, Item, Category, Auction, Bid
} = require('../models/index.js');
const { sequelize } = require('../utils/db.js');

// Generate random users
const generateRandomUsers = (count) => {
  const users = [];
  for (let i = 0; i < count; i++) {
    users.push({
      name: faker.person.firstName(),
      nickname: faker.person.middleName().substring(0, 20), // Truncate to 20 characters
      email: faker.internet.email(),
      phone: faker.phone.number().substring(0, 20), // Truncate to 20 characters
      password: faker.internet.password()
    });
  }
  return users;
};

// Generate random categories
const generateRandomCategories = (count) => {
  const categories = [];
  for (let i = 0; i < count; i++) {
    categories.push({
      name: faker.commerce.department(),
      description: faker.lorem.sentence()
    });
  }
  return categories;
};

// Generate random items
const generateRandomItems = (count, users, categories) => {
  const items = [];
  for (let i = 0; i < count; i++) {
    items.push({
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      userId: users[Math.floor(Math.random() * users.length)].id,
      categoryId: categories[Math.floor(Math.random() * categories.length)].id
    });
  }
  return items;
};

// Generate random auctions
const generateRandomAuctions = (count, items) => {
  const auctions = [];
  for (let i = 0; i < count; i++) {
    auctions.push({
      description: faker.commerce.productDescription(),
      end_time: faker.date.future(),
      starting_price: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
      current_price: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
      item_id: items[Math.floor(Math.random() * items.length)].id,
      user_id: items[Math.floor(Math.random() * items.length)].userId
    });
  }
  return auctions;
};

// Generate random bids
const generateRandomBids = (count, users, auctions) => {
  const bids = [];
  for (let i = 0; i < count; i++) {
    bids.push({
      amount: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
      auction_id: auctions[Math.floor(Math.random() * auctions.length)].id,
      buyer_id: users[Math.floor(Math.random() * users.length)].id
    });
  }
  return bids;
};

// Seed the database
const seedData = async () => {
  try {
    await sequelize.sync({ force: true }); // Drop and recreate tables
    console.log('🌱 Seeding database...');

    // Create users
    const users = await User.bulkCreate(generateRandomUsers(5), { returning: true });
    console.log('✅ Users created:', users.length);

    // Create categories
    const categories = await Category.bulkCreate(generateRandomCategories(5), { returning: true });
    console.log('✅ Categories created:', categories.length);

    // Create items
    const items = await Item.bulkCreate(generateRandomItems(10, users, categories), { returning: true });
    console.log('✅ Items created:', items.length);

    // Create auctions
    const auctions = await Auction.bulkCreate(generateRandomAuctions(5, items), { returning: true });
    console.log('✅ Auctions created:', auctions.length);

    // Create bids
    await Bid.bulkCreate(generateRandomBids(15, users, auctions));
    console.log('✅ Bids created:', 15);

    console.log('✅ Data seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    // await sequelize.close(); // Close the connection only after all operations are done
  }
};

// Run the script
// seedData();
module.exports = { seedData };
