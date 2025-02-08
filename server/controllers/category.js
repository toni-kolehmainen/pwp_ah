const { Category } = require('../models')

const getCategories = async (req, res) => {
  const categories = await Category.findAll()
  res.json(categories)
}

module.exports = {
  getCategories,
}