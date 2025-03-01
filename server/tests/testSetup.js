const { dbSync } = require('../models'); // Import your models
const { sequelize } = require('../utils/db'); // Import sequelize connection

// Define beforeAll hook to sync database and clean up the User model
module.exports.beforeAllSetup = async () => {
  await dbSync(); // Sync the database
  console.log('Database is synced and User table is cleared before running tests');
};

// Define afterAll hook to close the database connection after tests
module.exports.afterAllCleanup = async () => {
  sequelize.close(); // Close the database connection
  console.log('Database connection closed after tests');
};
