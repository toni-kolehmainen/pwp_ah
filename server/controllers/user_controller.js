const { User } = require('../models')

const getTest = (req, res) => {
    res.status(200).send("test")
}

const getUsers = async (req, res) => {
  const users = await User.findAll()
  res.json(users)
}

const addUser = async (req, res) => {
  try {
    const note = await User.create(req.body)
    res.json(note)
  } catch(error) {
    return res.status(400).json({ error })
  }
}

const getUser = async (req, res) => {
  res.status(200).send("test")
}

module.exports = {
  getTest,
  getUsers,
  addUser,
  getUser
}