const Sequelize = require('sequelize');
const { env } = require('node:process');
const logger = require('./logger');
const { NAME, PASSWORD, NODE_ENV } = require('./config');

const host = (env.DB_HOST) ? env.DB_HOST : 'localhost';
const db = (NODE_ENV === 'test') ? 'test' : 'postgres';

const sequelize = new Sequelize(db, NAME, PASSWORD, {
  host,
  dialect: 'postgres',
  logging: false
  // logging: console.log
});

const connectToDatabase = async () => {
  
  try {
    await sequelize.authenticate();
    logger.info('database connected');
  } catch (err) {
    logger.error(err);
    logger.info('connecting database failed');
    return process.exit(1);
  }

  return null;
};

module.exports = { connectToDatabase, sequelize };
