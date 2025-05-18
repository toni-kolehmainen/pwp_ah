const cron = require('node-cron');
const { auctionEndListener } = require('./service/email');

cron.schedule('* * * * *', async () => {
  await auctionEndListener();
});

console.log('Email worker started and cron job scheduled.');
