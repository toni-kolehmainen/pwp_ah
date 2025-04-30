const { createHalProfile } = require('../utils/hal');

// Function handles the request to get the user profile
const userPofile = async (req, res) => res.status(200).json(createHalProfile(':user_id', 'users'));

// Function handles the request to get the bid profile
const bidPofile = async (req, res) => res.status(200).json(createHalProfile(':bid_id', 'bids', false));

// Function handles the request to get the auction profile
const auctionPofile = async (req, res) => res.status(200).json(createHalProfile(':id', 'auctions', false));

// Function handles the request to get the category profile
const categoryPofile = async (req, res) => res.status(200).json(createHalProfile(':id', 'categories', false));

// Function handles the request to get the item profile
const itemPofile = async (req, res) => res.status(200).json(createHalProfile(':id', 'items'));

module.exports = {
  userPofile, bidPofile, auctionPofile, categoryPofile, itemPofile
};
