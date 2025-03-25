const { Bid } = require('../models');
const { createHalEmbedded } = require('../utils/hal');
const { getResource } = require('./get/base_resource');

// Function gets all bids from the database
const getBids = async (req, res, next) => {
  const bids = await getResource(Bid, { auction_id: req.params.auction_id }, next);
  if (!bids) return next(bids);

  // If no bids are found, return a 204 No Content response
  if (bids.length === 0) {
    return res.status(204).end();
  }
  // else respond with bid data and hypermedia
  return res.json({
    _links:
      {
        self: { href: `/api/auction/${req.params.auction_id}/bids` },
        profile: { href: '/profiles/bids/' },
        create: { href: '/api/bids', method: 'POST' }
      },
    _embedded: {
      bids: bids.map((bid) => createHalEmbedded(bid, 'bids', false))
    }
  });
};

module.exports = {
  getBids
};
