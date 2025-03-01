const { Auction } = require('../models');
const Item = require('../models/item');
const User = require('../models/user');
const { validate } = require('../utils/validation');
const schemas = require('../utils/schemas');

const getAuctionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const auction = await Auction.findByPk(id, {
      include: [
        { model: Item, as: 'item' },
        { model: User, as: 'seller' }
      ]
    });

    if (!auction) {
      return res.status(404).json({ error: 'Auction not found' });
    }

    return res.json(auction);
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
      current_price: starting_price,
      end_time: end_time || new Date(new Date().getTime() + 24 * 60 * 60 * 1000) // 24 hours
    });

    return res.status(201).json(auction);
  } catch (error) {
    // Handle specific validation errors
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ error: error.message });
    }

    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteAuction = async (req, res, next) => {
  try {
    const auction = await Auction.findByPk(req.params.id);
    if (!auction) {
      return res.status(404).json({ error: 'Auction not found' });
    }

    // Check if user is authorized to delete this auction
    if (auction.seller_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this auction' });
    }

    await auction.destroy();
    return res.json({ message: 'Auction deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Export router configuration with validation middleware applied
module.exports = {
  getAuctionById: [validate(schemas.auctionId, 'params'), getAuctionById],
  addAuction: [validate(schemas.auctionCreate, 'body'), addAuction],
  deleteAuction: [validate(schemas.auctionId, 'params'), deleteAuction]
};
