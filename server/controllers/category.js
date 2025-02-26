const Ajv = require('ajv');
const { Category } = require('../models');

const ajv = new Ajv({ coerceTypes: false });
// hypermedia
// relatedItems

const addSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    description: { type: 'string' }
  },
  required: ['name'],
  additionalProperties: false
};

// Maybe add empty
const getCategories = async (req, res) => {
  const categories = await Category.findAll();
  res.json(categories);
};

const addCategories = async (req, res) => {
  try {
    const validate = ajv.compile(addSchema);
    const valid = validate(req.body);

    if (!valid) return res.status(400).json({ status: 'Failed' });
    const note = await Category.create(req.body);
    return res.status(201).json(note);
  } catch (error) {
    return res.status(409).json({ error });
  }
};
// add tests
const deleteCategories = async (req, res, next) => {
  Category.destroy({
    where: {
      id: req.params.id
    }
  })
    .then((count) => {
      console.log(count);
      if (count === 0) {
        return res.status(404).json({ error: 'Category not found' });
      }
      return res.json({ status: 'Deleted' });
    }).catch((e) => {
      const error = new Error(e.message);
      error.name = e.name;
      return next(error);
    });
};

module.exports = {
  getCategories,
  addCategories,
  deleteCategories
};
