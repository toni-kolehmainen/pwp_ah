const { Auction } = require('../models')

// add combined auction and item data and user data
const getAuctions = async (req, res) => {
  // const auction = await Auction.findAll()
  // res.json(auction)
  res.status(501).json({ message: 'This is not implemented' })
}

const deleteAuctions = async (req, res) => {
  res.status(501).json({ message: 'This is not implemented' })
}

module.exports = {
  getAuctions,
  deleteAuctions
}