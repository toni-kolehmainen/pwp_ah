require('dotenv').config()

let NODE_ENV = process.env.NODE_ENV
let PORT = process.env.PORT
let DATABASE_URL = process.env.PORT
let NAME = process.env.NAME
let PASSWORD = process.env.PASSWORD
module.exports = {
  PORT,
  DATABASE_URL,
  NODE_ENV,
  NAME,
  PASSWORD
}