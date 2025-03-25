const { Auction } = require('../models');
const { createHalEmbedded } = require('../utils/hal');
const { getResource } = require('./get/base_resource');

// Function gets all auctions from the database
const getAuctions = async (req, res, next) => {
  const auctions = await getResource(Auction, { seller_id: req.params.user_id }, next);
  if (!auctions) return next(auctions);

  // If no auctions are found, return a 204 No Content response
  if (auctions.length === 0) {
    return res.status(204).end();
  }
  // else respond with bid data and hypermedia
  return res.json({
    _links:
    {
      self: { href: `/api/users/${req.params.auction_id}/auctions` },
      profile: { href: '/profiles/auctions/' },
      create: { href: '/api/auctions', method: 'POST' }
    },
    _embedded: {
      auctions: auctions.map((auction) => createHalEmbedded(auction, 'auctions', false))
    }
  });
};

module.exports = {
  getAuctions
};
