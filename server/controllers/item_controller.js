const { Item } = require('../models')

const getItems = (req, res) => {
  res.status(200).send("test")
}

const addItem = (req, res) => {
  res.status(200).send("test")
}

const placeBid = (req, res) => {
  res.status(200).send("test")
}

module.exports = {
  getItems,
  addItem,
  placeBid
}