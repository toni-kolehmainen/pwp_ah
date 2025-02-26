const app = require('./app');
const config = require('./utils/config');
const logger = require('./utils/logger');
const { connectToDatabase } = require('./utils/db');
const { User } = require('./models'); // Import the User model
const { seedData } = require('./script/DataPopulator'); // Import the seedData function

// checking if the database is empty and populate data if necessary
const initializeDatabase = async () => {
  try {
    // Check if the User table is empty
    let userCount = -1;

    userCount = await User.count();
    // Promise((resolve) => setTimeout(resolve, 1000));
    // userCount = 0
    if (userCount === 0) {
      logger.info('Database is empty. Populating data...');
      await seedData(); // Run the data population script
    } else {
      logger.info('Database already contains data. Skipping population.');
    }
  } catch (error) {
    logger.error('Error initializing database:', error);
  }
};

// Start the server
const start = async () => {
  try {
    await connectToDatabase(); // Connect to the database
    logger.info('Database connection established.');

    await initializeDatabase(); // Check and populate data if necessary

    app.listen(config.PORT, () => {
      logger.info(`Server running on port ${config.PORT}`);
    });
  } catch (error) {
    logger.error('Unable to start the server:', error);
  }
};

start();
