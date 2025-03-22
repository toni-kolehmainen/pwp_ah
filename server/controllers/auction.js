const { Auction } = require('../models');
const Item = require('../models/item');
const User = require('../models/user');
const { validate } = require('../utils/validation');
const schemas = require('../utils/schemas');
const { createHalLinks } = require('../utils/hal');

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

    // Return the auction as a plain object
    return res.json(createHalLinks(auction, 'auctions', false, true));
  } catch (error) {
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
  deleteAuction: [validate(schemas.auctionId, 'params'), deleteAuction]
};
