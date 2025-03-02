const { Auction } = require('../models');
const Item = require('../models/item');
const User = require('../models/user');
const { validate } = require('../utils/validation');
const schemas = require('../utils/schemas');

const getAuctions = async (req, res, next) => {
  try {
    const {
      limit = 10, offset = 0, sort = 'end_time', order = 'ASC'
    } = req.query;

    const auctions = await Auction.findAll({
      attributes: ['id', 'description', 'end_time', 'starting_price', 'current_price', 'user_id', 'item_id', 'seller_id'],
      order: [[sort, order]],
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10)
    });

    if (!auctions || auctions.length === 0) {
      return res.status(204).send();
    }
    return res.status(200).json(auctions);
  } catch (error) {
    console.error('Error in getAuctions: ', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteAuctions = async (req, res, next) => {
  try {
    await Auction.destroy({ where: {} });
    return res.json({ message: 'All auctions deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Export router configuration with validation middleware applied
module.exports = {
  getAuctions: [validate(schemas.auctionsQuery, 'query'), getAuctions],
  deleteAuctions
};
