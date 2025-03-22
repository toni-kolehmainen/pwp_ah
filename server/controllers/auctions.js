const { Auction } = require('../models');
const Item = require('../models/item');
const User = require('../models/user');
const { validate } = require('../utils/validation');
const schemas = require('../utils/schemas');
const { createHalLinks, createHalEmbedded } = require('../utils/hal');

const getAuctions = async (req, res) => {
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
      return res.status(204).end();
    }
    return res.status(200).json({
      _links:
        {
          self: { href: '/api/auctions/' },
          profile: { href: '/profiles/auctions/' },
          create: { href: '/api/auctions', method: 'POST' }
        },
      _embedded: {
        auctions: auctions.map((auction) => createHalEmbedded(auction, 'auctions', false, true))
      }
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const addAuction = async (req, res, next) => {
  try {
    const {
      item_id, description, starting_price, end_time
    } = req.body;
    const seller_id = req.user.id;

    const auction = await Auction.create({
      item_id,
      seller_id,
      description,
      starting_price,
      current_price: starting_price
      // end_time: end_time || new Date(new Date().getTime() + 24 * 60 * 60 * 1000) // 24 hours
    });
    // (resource, path, canEdit = true, canDelete = true)
    return res.status(201).json(createHalLinks(auction, 'auctions', false, true));
  } catch (error) {
    // Handle specific validation errors
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ error: error.message });
    }

    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Export router configuration with validation middleware applied
module.exports = {
  getAuctions: [validate(schemas.auctionsQuery, 'query'), getAuctions],
  addAuction: [validate(schemas.auctionCreate, 'body'), addAuction]
};
