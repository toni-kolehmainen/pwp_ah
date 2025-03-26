const { Op } = require('sequelize');
const { Auction, Bid } = require('../models');

const outdatedBidsAndAuctions = async (currentTime) => {
  try {
    // get outdated auctions that are removed
    const outdatedAuctions = await Auction.findAll({
      where: {
        end_time: { [Op.lt]: currentTime }
      },
      raw: true
    });
    // get outdated bids that are removed
    const bids = await Promise.all(
      outdatedAuctions.map(async (auction) => {
        const _bids = await Bid.findAll({ where: { auction_id: auction.id }, raw: true });
        return _bids;
      })
    );
    const outdatedBids = bids.flat();
    return { outdatedAuctions, outdatedBids };
  } catch (e) {
    console.error('Error getting outdated model object:', e);
    return { error: 'Error getting outdated model object' };
  }
};

module.exports = {
  outdatedBidsAndAuctions
};
