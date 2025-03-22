const Ajv = require('ajv');
const { Bid } = require('../models');
const { createHalLinks, createHalEmbedded } = require('../utils/hal');

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
const getBids = async (req, res) => {
  const bids = await Bid.findAll({
  });

  // If no bids are found, return a 204 No Content response
  if (bids.length === 0) {
    return res.status(204).end();
  }
  console.log('TEST');
  // else respond with bid data and hypermedia
  return res.json({
    _links:
      {
        self: { href: '/api/bids/' },
        profile: { href: '/profiles/bids/' },
        create: { href: '/api/bids', method: 'POST' }
      },
    _embedded: {
      bids: bids.map((bid) => createHalEmbedded(bid, 'bids'))
    }
  });
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

    // Create a new bid in the database
    const bid = await Bid.create(req.body);
    return res.status(201).json(createHalLinks(bid, 'bids'));
  } catch (e) {
    // If an error occurs, handle the error
    const error = new Error(e.message);
    error.name = e.name;
    if (e.errors !== undefined) {
      if (e.errors.length !== 0) {
        error.message = e.errors[0].message;
      }
    }
    return next(error); // Pass the error to the next middleware (error handler)
  }
};

module.exports = {
  getBids, addBid
};
