const Sequelize = require('sequelize');
const { env } = require('node:process');

const name = env.NAME;
const password = env.PASSWORD;
const db = env.DB_NAME;
const host = env.DB_HOST;

const sequelize = new Sequelize(db, name, password, {
  host,
  dialect: 'postgres',
  logging: false
});

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('database connected');
  } catch (err) {
    console.log(err);
    console.log('connecting database failed');
    return process.exit(1);
  }

  return null;
};

module.exports = { connectToDatabase, sequelize };
