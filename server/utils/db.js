const Sequelize = require('sequelize')
const { env } = require('node:process');

const { DATABASE_URL, NAME, PASSWORD, NODE_ENV } = require('./config')

const host = (env.DB_HOST) ? env.DB_HOST : 'localhost'

const db = (NODE_ENV === "test") ? "test" : 'postgres'
const sequelize = new Sequelize(db, NAME, PASSWORD, {
  host: host,
  dialect: 'postgres',
  logging: false,
  // logging: console.log
});

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    console.log('database connected')
  } catch (err) {
    console.log(err)
    console.log('connecting database failed')
    return process.exit(1)
  }

  return null
}

module.exports = { connectToDatabase, sequelize }