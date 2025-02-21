const { Item } = require('../models')

const getItem = (req, res) => {
  res.status(501).json({ message: 'This is not implemented' })
  // Item.findOne({
  //   where: {
  //     id: req.params.id
  //   }
  // }).then((item) => {
  //   res.json(item)
  // }).catch((error) => {
  //   return res.status(400).json({ error })
  // })
}

const addItem = (req, res) => {
  res.status(501).json({ message: 'This is not implemented' })
    // Item.create(req.body)
    // .then(() => {
    //   res.json({ status: 'Added' })
    // })
    // .catch((error) => {
    //   return res.status(400).json({ error })
    // })
}

const updateItem = (req, res) => {
  res.status(501).json({ message: 'This is not implemented' })
  // Item.update(req.body, {
  //   where: {
  //     id: req.params.id
  //   }
  // })
}

const deleteItem = (req, res) => {
  res.status(501).json({ message: 'This is not implemented' })
  // Item.destroy({
  //   where: {
  //     id: req.params.id
  //   }
  // })
  // .then(() => {
  //   res.json({ status: 'Deleted' })
  // })
}

module.exports = {
  getItem,
  addItem,
  updateItem,
  deleteItem
}