const { Bid } = require('../models');
const { getResource } = require('./base_resource/get_all');

// Function gets bids by auction_id from the database
const getBids = async (req, res, next) => {
  await getResource(
    {
      model: Bid,
      where: { auction_id: req.params.auction_id },
      attributes: {}
    },
    {
      self: `/api/auction/${req.params.auction_id}/bids`,
      path: 'bids',
      edit: false
    },
    res,
    next
  );
};

module.exports = {
  getBids
};
