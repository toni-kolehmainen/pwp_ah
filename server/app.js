const express = require('express');

const app = express();
const cors = require('cors');
// const cron = require('node-cron');
const middleware = require('./utils/middleware');
const router = require('./router');

// cron.schedule('*/2 * * * *', () => {
//   console.log('delete example bids');
// });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use((_, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(middleware.limiter);
app.use('/api', router);
app.use(middleware.requestLogger);
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
