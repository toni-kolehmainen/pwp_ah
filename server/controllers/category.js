const Ajv = require('ajv');
const { Category } = require('../models');

const ajv = new Ajv({ coerceTypes: false });
const { createHalLinks, createHalEmbedded, deleteHalLinks } = require('../utils/hal');

// The schema for adding a new category
const addSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    description: { type: 'string' }
  },
  required: ['name'],
  additionalProperties: false
};

const getCategories = async (req, res) => {
  // Find a categories in the database
  const categories = await Category.findAll();
  res.json({
    _links:
      {
        self: { href: '/api/categories/' },
        profile: { href: '/profiles/categories/' },
        create: { href: '/api/categories', method: 'POST' }
      },
    _embedded: {
      categories: categories.map((category) => createHalEmbedded(category.toJSON(), 'categories', false))
    }
  });
};

const addCategories = async (req, res) => {
  try {
    // Validate the request body using the addSchema and ajv
    const validate = ajv.compile(addSchema);
    const valid = validate(req.body);

    // If validation fails, return 400 Bad Request
    if (!valid) return res.status(400).json({ status: 'Failed' });

    const category = await Category.create(req.body);
    return res.status(201).json(createHalLinks(category, 'categories', false));
  } catch (error) {
    return res.status(409).json({ error });
  }
};

const deleteCategories = async (req, res, next) => {
  // Delete the category from the database based on the category ID
  Category.destroy({
    where: {
      id: req.params.id
    }
  })
    .then((count) => {
      // If no category was deleted (i.e., count is 0), return a 404 Not Found response
      if (count === 0) {
        return res.status(404).json({ error: 'Category not found' });
      }

      // Else the deletion is successful, return a response indicating the category was deleted
      return res.json(deleteHalLinks('categories'));
    }).catch((e) => {
      // If an error occurs, handle the error
      const error = new Error(e.message);
      error.name = e.name;
      return next(error); // Pass the error to the next middleware (error handler)
    });
};

module.exports = {
  getCategories,
  addCategories,
  deleteCategories
};
