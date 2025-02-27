const { Auction } = require('../models');
const Item = require('../models/item'); // Import the Item model
const User = require('../models/user'); // Import the User model

const getAuctionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const auction = await Auction.findByPk(id, {
      include: [
        { model: Item, as: 'item' }, // Include related item
        { model: User, as: 'seller' } // Include seller details
      ]
    });
    if (!auction) {
      return res.status(404).json({ error: 'Auction not found' });
    }
    return res.json(auction);
  } catch (e) {
    const error = new Error(e.message);
    error.name = e.name;
    return next(error);
  }
};


// POST /auction: Create a new auction
const addAuction = async (req, res, next) => {
  try {

    const { item_id,desctription, starting_price, end_time  } = req.body;
    const seller_id = req.user.id;

    // Validate required fields
    if (!starting_price || starting_price <= 0) {
      return res.status(400).json({ error: 'Invalid starting price' });
    }

    const auction = await Auction.create({
      item_id,
      seller_id,
      desctription,
      starting_price,
      current_price: starting_price,
      end_time: end_time || new Date(new Date().getTime() + 24 * 60 * 60 * 1000) // 24 hours
    });

    return res.status(201).json(auction);
  } catch (e) {
    const error = new Error(e.message);
    error.name = e.name;
    return next(error);
  }
};

// DELETE /auction/:id: Delete an auction by ID
const deleteAuction = async (req, res, next) => {
  try {
    const auction = await Auction.findByPk(req.params.id);
    if (!auction) {
      return res.status(404).json({ error: 'Auction not found' });
    }
    await auction.destroy();
    return res.json({ message: 'Auction deleted successfully' });
  } catch (e) {
    const error = new Error(e.message);
    error.name = e.name;
    return next(error);
  }
};

module.exports = {
  // getAuction,
  getAuctionById,
  addAuction,
  deleteAuction,
};