const { Item } = require('../models');
const Ajv = require('ajv');
const ajv = new Ajv({ coerceTypes: false });
const jwt = require('jsonwebtoken')
const { isNumeric } = require('validator')
const { error } = require('../utils/logger')

const addSchema = {
type: "object",
properties: {
  name: { type: "string" },
  description: { type: "string" },
  user_id: { type: "number" },
  category_id: { type: "number" },
},
required: ["name", "user_id", "category_id"],
additionalProperties: false
};

const updateSchema = {
type: "object",
properties: {
  name: { type: "string" },
  description: { type: "string" },
  user_id: { type: "number" },
  category_id: { type: "number" },
},
minProperties: 1,
maxProperties: 1,
additionalProperties: false
};


const getItem = async (req, res, next) => {
try {
  const item = await Item.findOne({
    where: {
      id: req.params.id
    },
    //attributes: {exclude: ['userId','categoryId']} 
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
  res.status(201).json(item);
} catch (e) {
  const error = new Error(e.message);
  error.name = e.name;
  return next(error);
}
};

const updateItem = async (req, res, next) => {
const validate = ajv.compile(updateSchema);
const valid = validate(req.body);
if (!valid) {
  const error = new Error('Invalid Request body');
  error.name = 'ValidationError';
  return next(error);
}
try {
  const [updated] = await Item.update(req.body, {
    where: {
      id: req.params.id
    }
  });
  if (updated) {
    const updatedItem = await Item.findOne({ where: { id: req.params.id } });
    return res.status(200).json(updatedItem);
  }
  throw new Error('Item not found');
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
    return res.status(204).send();
  }

  throw new Error('Item not found');
} catch (e) {
  const error = new Error(e.message);
  error.name = e.name;
  return next(error);
}
};

module.exports = {
getItem,
addItem,
updateItem,
deleteItem
};