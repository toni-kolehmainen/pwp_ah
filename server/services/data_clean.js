const { Op } = require('sequelize');
const { Auction, Bid } = require('../models');
const { cache } = require('../utils/cacheMiddleware');
const { dataBackUp } = require('./removed_backup');

const deleteModelData = async (Resource, timeCondition) => {
  try {
    const outdatedAuctions = await Resource.findAll({
      where: timeCondition,
      raw: true
    });
    // an array of bid IDs
    const bidIds = await Promise.all(
      outdatedAuctions.map(async (auction) => {
        const bids = await Bid.findAll({ where: { auction_id: auction.id } });
        return bids.map((bid) => bid.id);
      })
    );
    const flatBidIds = bidIds.flat();

    console.log('Cache keys before deletion:', cache.keys());

    outdatedAuctions.forEach((auction) => {
      const cacheKey = `/api/auctions/${auction.id}`;
      cache.del(cacheKey); // Delete cache for this auction

      console.log(`Cache for auction ${auction.id} invalidated.`);

      // Invalidate the cache for all bids related to this auction
      flatBidIds.forEach((id) => {
        const bidCacheKey = `/api/bids/${id}`;
        cache.del(bidCacheKey); // Delete cache for this bid
        console.log(`Cache for bid ${id} invalidated.`);
      });
    });
    const count = await Resource.destroy({
      where: timeCondition
    });

    // reset cache for auctions and bids
    cache.del('/api/auctions');
    cache.del('/api/bids');

    console.log('Cache keys after deletion:', cache.keys());
    if (count === 0) {
      return { error: 'No expired auctions found' };
    }
    return { status: 'Deleted', deletedCount: count };
  } catch (e) {
    console.error('Error deleting auctions:', e);
    return { error: 'Error deleting auctions' };
  }
};

const dataClean = async () => {
  const currentTime = new Date();
  const mesbackUp = await dataBackUp(1, currentTime);

  const mesDelete = await deleteModelData(Auction, {
    end_time: { [Op.lt]: currentTime }
  });

  return { mesbackUp, mesDelete };
};

module.exports = {
  dataClean
};
