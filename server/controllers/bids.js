const { Bid } = require('../models')

const getBids = async (req, res) => {
  res.status(501).json({ message: 'This is not implemented' })
  // const bids = await Bid.findAll()
  // res.json(bids)
}

const deleteBids = async (req, res) => {
  res.status(501).json({ message: 'This is not implemented' })
  // const bids = await Bid.destroy()
  // res.json(bids)
}

module.exports = {
  getBids,
  deleteBids,
}