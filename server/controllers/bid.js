const { Bid } = require('../models');
const { createHalLinks } = require('../utils/hal');

// Function gets single bid from the database
const getBid = async (req, res, next) => {
  Bid.findOne({
    where: {
      id: req.params.bid_id
    }
  }).then((bid) => {
    // If no bid is found, return a 404 response
    if (!bid) {
      return res.status(404).end();
    }

    // else respond with bid data and hypermedia
    return res.json(createHalLinks(bid.toJSON(), 'bids'));
  }).catch((e) => {
    const error = new Error(e.message);
    error.name = e.name;
    return next(error);
  });
};

const deleteBid = (req, res, next) => {
  Bid.destroy({
    where: {
      id: req.params.bid_id
    }
  }).then((count) => {
    console.log(count);
    if (count === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json({ status: 'Deleted' });
  }).catch((e) => {
    const error = new Error(e.message);
    error.name = e.name;
    return next(error);
  });
};

module.exports = {
  getBid, deleteBid
};
