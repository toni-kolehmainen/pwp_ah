const { Auction } = require('../models');

// GET /auction/:id: Get a specific auction by ID
const getAuction = async (req, res, next) => {
  try {
    const auction = await Auction.findByPk(req.params.id, {
      attributes: ['id', 'desctription', 'end_time', 'starting_price', 'current_price']
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
    const { desctription, starting_price, end_time } = req.body;

    // Validate required fields
    if (!starting_price || starting_price <= 0) {
      return res.status(400).json({ error: 'Invalid starting price' });
    }

    const auction = await Auction.create({
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
  getAuction,
  addAuction,
  deleteAuction,
};