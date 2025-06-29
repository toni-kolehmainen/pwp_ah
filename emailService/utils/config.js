require('dotenv').config();

const { NODE_ENV } = process.env;
const { PORT } = process.env;
const DATABASE_URL = process.env.PORT;
const { NAME } = process.env;
const { PASSWORD } = process.env;
const { EMAIL } = process.env;
const { PASSWORD_ETH } = process.env;

module.exports = {
  PORT,
  DATABASE_URL,
  NODE_ENV,
  NAME,
  PASSWORD,
  EMAIL,
  PASSWORD_ETH
};
