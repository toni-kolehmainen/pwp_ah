const Ajv = require('ajv');
const { Item } = require('../models');

const ajv = new Ajv({ coerceTypes: false });
const { createHalLinks, putHalLinks, deleteHalLinks } = require('../utils/hal');

const updateSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    description: { type: 'string' },
    userId: { type: 'number' },
    categoryId: { type: 'number' }
  },
  minProperties: 1,
  additionalProperties: false
};

const getItem = async (req, res, next) => {
  try {
    const item = await Item.findOne({
      where: {
        id: req.params.id
      }
    });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json(item);
  } catch (e) {
    const error = new Error(e.message);
    error.name = e.name;
    return next(error);
  }
};

const updateItem = async (req, res, next) => {
  try {
    const validate = ajv.compile(updateSchema);
    const valid = validate(req.body);

    if (!valid) {
      const error = new Error('Invalid Request body');
      error.name = 'ValidationError';
      return next(error);
    }

    const [updated, updatedItems] = await Item.update(req.body, {
      where: {
        id: req.params.id
      },
      returning: true
    });

    if (updated == !0) {
      return res.status(200).json(putHalLinks(updatedItems, 'items'));
    }

    return res.status(404).json({ error: 'Item not found' });
  } catch (e) {
    const error = new Error(e.message);
    error.name = e.name;
    return next(error);
  }
};

const deleteItem = async (req, res, next) => {
  try {
    const deleted = await Item.destroy({
      where: {
        id: req.params.id
      }
    });

    if (deleted) {
      return res.json(deleteHalLinks('items'));
    }

    return res.status(404).json({ error: 'Item not found' });
  } catch (e) {
    const error = new Error(e.message);
    error.name = e.name;
    return next(error);
  }
};

module.exports = {
  getItem,
  updateItem,
  deleteItem
};
