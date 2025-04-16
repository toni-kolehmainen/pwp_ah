const Ajv = require('ajv');
const { Bid, Auction } = require('../models');
const { createHalLinks } = require('../utils/hal');
const { getResource } = require('./base_resource/get_all');

const ajv = new Ajv({ coerceTypes: false });

// The schema for adding a new bid
const addSchema = {
  type: 'object',
  properties: {
    auction_id: { type: 'integer' },
    buyer_id: { type: 'integer' },
    amount: { type: 'number' }
  },
  required: ['auction_id', 'buyer_id', 'amount'],
  additionalProperties: false
};

// Function gets all bids from the database
const getBids = async (req, res, next) => {
  await getResource(
    {
      model: Bid,
      where: {},
      attributes: {}
    },
    {
      self: '/api/bids/',
      path: 'bids',
      edit: false
    },
    res,
    next
  );
};

// Function to add a new bid to the database
const addBid = async (req, res, next) => {
  try {
    // Validate the request body using the addSchema and ajv
    const validate = ajv.compile(addSchema);
    const valid = validate(req.body);

    // If validation fails, return a validation error
    if (!valid) {
      const error = new Error('Invalid Request body');
      error.name = 'ValidationError';
      return next(error);
    }
    const date = new Date();
    const auction = await Auction.findOne({
      where: { id: req.body.auction_id },
      returning: true
    });

    if (!auction) {
      return res.status(404).json({ error: 'Auction not found' });
    }

    if (auction.end_time < date.getTime()) {
      const error = new Error('Auction has ended');
      error.name = 'ValidationError';
      return next(error);
    }

    if (req.body.amount <= auction.current_price) {
      const error = new Error('Bid must be higher than current bid');
      error.name = 'ValidationError';
      return next(error);
    }

    // Create a new bid in the database
    const bid = await Bid.create(req.body);

    await Auction.update(
      { current_price: req.body.amount },
      {
        where: { id: req.body.auction_id }
      }
    );

    return res.status(201).json(createHalLinks(bid.toJSON(), 'bids', false));
  } catch (e) {
    // If an error occurs, handle the error
    const error = new Error(e.message);
    error.name = e.name;
    error.message = e.errors?.[0]?.message || error.message;

    return next(error); // Pass the error to the next middleware (error handler)
  }
};

module.exports = {
  getBids, addBid
};
