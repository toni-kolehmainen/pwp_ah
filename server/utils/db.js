const Sequelize = require('sequelize')
const { env } = require('node:process');
const { DATABASE_URL, NAME, PASSWORD } = require('./config')

const host = (env.DB_HOST) ? env.DB_HOST : 'localhost'

const sequelize = new Sequelize('postgres', NAME, PASSWORD, {
  host: host,
  dialect: 'postgres',
  logging: console.log
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