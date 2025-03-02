const { Bid } = require('../models');

const getBids = async (req, res) => {
  const bids = await Bid.findAll({
    // include: [
    //   {
    //       model: User,
    //       attributes: ['id', 'name', 'email']
    //   },
    //   {
    //       model: Auction,
    //       attributes: ['user_id','item_id','created_at', 'end_time', 'current_price']
    //   }
    // ],
    // attributes: { exclude: ['buyer_id', 'auction_id'] }
  });
  if (bids.length === 0) {
    return res.status(204).end();
  }
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
