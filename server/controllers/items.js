const { Item } = require('../models');

// hypermedia
// to auction, to bids, to items?

const getItems = async (req, res, next) => {
  try {
    const items = await Item.findAll();
    if (!items || items.length === 0) {
      return res.status(204).end();
    }
    res.json(items);
  } catch (e) {
    const error = new Error(e.message);
    error.name = e.name;
    return next(error);
  }
};

module.exports = {
  getItems
};
