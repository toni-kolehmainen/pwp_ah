const Ajv = require('ajv');
const { Bid } = require('../models');

const ajv = new Ajv({ coerceTypes: false });

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

const getBid = async (req, res, next) => {
  Bid.findOne({
    where: {
      id: req.params.bid_id
    }
  }).then((bid) => {
    if (!bid) {
      return res.status(404).end();
    }
    return res.json(bid);
  }).catch((e) => {
    const error = new Error(e.message);
    error.name = e.name;
    return next(error);
  });
};

const addBid = async (req, res, next) => {
  try {
    const validate = ajv.compile(addSchema);
    const valid = validate(req.body);

    if (!valid) {
      const error = new Error('Invalid Request body');
      error.name = 'ValidationError';
      return next(error);
    }

    const bid = await Bid.create(req.body);
    return res.status(201).json(bid);
  } catch (e) {
    const error = new Error(e.message);
    error.name = e.name;
    if (e.errors.length !== 0) {
      error.message = e.errors[0].message;
    }
    return next(error);
  }
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
  getBid, deleteBid, addBid
};
