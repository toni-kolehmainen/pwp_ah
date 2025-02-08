const { Bid } = require('../models')

const getBids = async (req, res) => {
  const bid = await Bid.findAll()
  res.json(bid)
}

module.exports = {
  getBids,
}