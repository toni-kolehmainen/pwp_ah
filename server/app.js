const express = require('express');

const app = express();
const cors = require('cors');
const cron = require('node-cron');
const middleware = require('./utils/middleware');
const router = require('./router');
const routerProfile = require('./router/profile');
const { dataClean } = require('./services/data_clean');

cron.schedule('* * * * *', async () => {
  // cron.schedule('0 0 * * 1', async () => { // a week
  const mes = await dataClean();
  console.log(mes);
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Adding access control allow headers
app.use((_, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// app.use(middleware.limiter);

// Adding the middleware
app.use(middleware.cacheMiddleware);

app.use('/profile', routerProfile);
app.use('/api', router);
app.use(middleware.requestLogger);
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
