const userProperties = require('./user');
const itemProperties = require('./item');
const categoryProperties = require('./category');
const auctionProperties = require('./auction');
const bidProperties = require('./bid');

const resourceProperties = (path) => {
  if (path === 'users') {
    return userProperties;
  } if (path === 'items') {
    return itemProperties;
  } if (path === 'categories') {
    return categoryProperties;
  } if (path === 'auctions') {
    return auctionProperties;
  } if (path === 'bids') {
    return bidProperties;
  }
  return { message: 'Resource not found' };
};
module.exports = {
  resourceProperties,
  userProperties,
  itemProperties,
  categoryProperties,
  auctionProperties,
  bidProperties
};
