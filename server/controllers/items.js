const Ajv = require('ajv');
const { Item } = require('../models');

const ajv = new Ajv({ coerceTypes: false });
const { createHalLinks, createHalEmbedded } = require('../utils/hal');

const addSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    description: { type: 'string' },
    userId: { type: 'number' },
    categoryId: { type: 'number' }
  },
  required: ['name', 'userId', 'categoryId'],
  additionalProperties: false
};

const getItems = async (req, res, next) => {
  try {
    const items = await Item.findAll();
    if (!items || items.length === 0) {
      return res.status(204).end();
    }
    return res.json({
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
  } catch (e) {
    const error = new Error(e.message);
    error.name = e.name;
    return next(error);
  }
};

const addItem = async (req, res, next) => {
  const validate = ajv.compile(addSchema);
  const valid = validate(req.body);

  if (!valid) {
    const error = new Error('Invalid Request body');
    error.name = 'ValidationError';
    return next(error);
  }

  try {
    const item = await Item.create(req.body);
    res.status(201).json(createHalLinks(item, 'items'));
  } catch (e) {
    const error = new Error(e.message);
    error.name = e.name;
    return next(error);
  }
};

module.exports = {
  getItems, addItem
};
