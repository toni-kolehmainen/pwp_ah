const Ajv = require('ajv');
const { Item } = require('../models');

const ajv = new Ajv({ coerceTypes: false });
const { createHalLinks, createHalEmbedded } = require('../utils/hal');

const addSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    description: { type: 'string' },
    seller_id: { type: 'number' },
    category_id: { type: 'number' }
  },
  required: ['name', 'seller_id', 'category_id'],
  additionalProperties: false
};

const getItems = async (req, res) => {
  try {
    const items = await Item.findAll();
    if (!items || items.length === 0) {
      return res.status(204).end();
    }
    console.log(items);
    return res.status(200).json({
      _links:
      {
        self: { href: '/api/items/' },
        profile: { href: '/profiles/items/' },
        create: { href: '/api/items', method: 'POST' }
      },
      _embedded: {
        items: items.map((item) => createHalEmbedded(item, 'items'))
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const addItem = async (req, res, next) => {
  try {
    const validate = ajv.compile(addSchema);
    const valid = validate(req.body);
    console.log('after validation');
    if (!valid) {
      console.log('Invalid Request body');
      const error = new Error('Invalid Request body');
      error.name = 'ValidationError';
      return next(error);
    }
    console.log('after Error');
    console.log(req.body);
    console.log(valid);

    const item = await Item.create(req.body);

    return res.status(201).json(createHalLinks(item, 'items'));
  } catch (e) {
    const error = new Error(e.message);
    error.name = e.name;
    return next(error);
  }
};

module.exports = {
  getItems, addItem
};
