const app = require('./app');
const config = require('./utils/config');
const logger = require('./utils/logger');
const { connectToDatabase } = require('./utils/db');

// Start the server
const start = async () => {
  try {
    await connectToDatabase(); // Connect to the database
    logger.info('Database connection established.');

    app.listen(config.PORT, () => {
      logger.info(`Server running on port ${config.PORT}`);
    });
  } catch (error) {
    logger.error('Unable to start the server:', error);
  }
};

start();
