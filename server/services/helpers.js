const { Auction, Bid } = require('../models');

const outdatedBidsAndAuctions = async (condition, include, highestOnly = false) => {
  try {
    // get outdated auctions that are removed
    const outdatedAuctions = await Auction.findAll({
      where: condition,
      include: include.auction,
      raw: true
    });

    // get outdated bids that are removed
    const bids = await Promise.all(
      outdatedAuctions.map(async (auction) => {
        const queryOptions = {
          where: { auction_id: auction.id },
          include: include.bid,
          raw: true // Return raw data, not instances
        };

        // If we need to get only the highest bid, add `order` and `limit` to the query
        if (highestOnly) {
          queryOptions.order = [['amount', 'DESC']];
          queryOptions.limit = 1;
        }
        const _bids = await Bid.findAll(queryOptions);
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
