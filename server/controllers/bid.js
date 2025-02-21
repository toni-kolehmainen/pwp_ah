const { Bid } = require('../models')

const getBid = async (req, res) => {

  const bid = await Bid.findAll()
  res.status(501).json({ message: 'This is not implemented' })
}

const addBid = async (req, res) => {

  res.status(501).json({ message: 'This is not implemented' })
}

const deleteBid = async (req, res) => {

  res.status(501).json({ message: 'This is not implemented' })
}

module.exports = {
  getBid, deleteBid, addBid
}