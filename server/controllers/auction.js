const { Auction } = require('../models');

// add combined auction and item data and user data
const getAuction = async (req, res) => {
  const auction = await Auction.findAll();
  res.json(auction);
};

const addAuction = async (req, res) => {
  res.status(501).json({ message: 'This is not implemented' });
};

const deleteAuction = async (req, res) => {
  res.status(501).json({ message: 'This is not implemented' });
};

module.exports = {
  getAuction, addAuction, deleteAuction
};
