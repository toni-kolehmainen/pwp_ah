const { Auction } = require('../models')

// add combined auction and item data and user data
const getAuction = async (req, res) => {
  const auction = await Auction.findAll()
  res.json(auction)
}

module.exports = {
  getAuction,
}