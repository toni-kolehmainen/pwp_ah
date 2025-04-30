const { Auction } = require('../models');
const { getResource } = require('./base_resource/get_all');

// Function gets all auctions from the database
const getAuctions = async (req, res, next) => {
  await getResource(
    {
      model: Auction,
      where: { seller_id: req.params.user_id },
      attributes: {}
    },
    {
      self: `/api/users/${req.params.user_id}/auctions`,
      path: 'auctions',
      edit: false
    },
    res,
    next
  );
};

module.exports = {
  getAuctions
};
