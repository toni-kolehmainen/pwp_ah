const { Bid } = require('../models');

const getBids = async (req, res) => {
  const bids = await Bid.findAll();
  if (!bids) {
    return res.status(204).end();
  }
  console.log("all bids data -> ",bids);
  return res.json(bids);
};

const deleteBids = async (req, res) => {
  const bids = await Bid.destroy();
  return res.json(bids);
};

module.exports = {
  getBids,
  deleteBids
};
