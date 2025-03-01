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
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// POST /auction: Create a new auction
const addAuction = async (req, res, next) => {
  try {
    const {
      item_id, description, starting_price, end_time
    } = req.body;
    const seller_id = req.user.id;

    // Validate required fields
    if (!starting_price || starting_price <= 0) {
      return res.status(400).json({ error: 'Invalid starting price' });
    }

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

// DELETE /auction/:id: Delete an auction by ID
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

module.exports = {
  getAuctionById,
  addAuction,
  deleteAuction
};