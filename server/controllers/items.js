const { Item } = require('../models')

const getItems = async (req, res) => {
  const items = await Item.findAll()
  res.status(501).json({ message: 'This is not implemented' })
  // res.json(items)
}

module.exports = {
  getItems,
}