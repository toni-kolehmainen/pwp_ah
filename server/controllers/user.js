const { User } = require('../models')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Ajv = require('ajv')
const { isNumeric } = require('validator')
const { error } = require('../utils/logger')
const ajv = new Ajv({ coerceTypes: false })

// hypermedia
// Seller's Active Auctions
// editProfile
// userBids

const addSchema = {
  type: "object",
  properties: {
    name: {type: "string"},
    nickname: {type: "string"},
    email: {type: "string"},
    phone: {type: "string"},
    password: {type: "string"},
  },
  required: ["name", "email","phone", "password"],
  additionalProperties: false
}
// check is json
// check schema
// check if exist/allready created

// add converter
const getUser = async (req, res, next) => {

  if (!isNumeric(req.params.user_id)) {
    const error = new Error('Invalid ID');
    error.name = 'CastError'; 
    return next(error);
  }
  const user = await User.findOne({
    where:{
      id: req.params.user_id
    }
  })
  if (!user) {
    return res.status(204).end()
  }
  res.json(user)
}

// If allready created
// add empty 200/json
const addUser = async (req, res, next) => {
  // try {
    const validate = ajv.compile(addSchema);
    const valid = validate(req.body);

    if (!valid) {
      const error = new Error('Invalid Request body');
      error.name = 'ValidationError';
      return next(error);
    }
    // const user = await User.create(req.body)
    // const saltRounds = 10
    // const password = await bcrypt.hash(req.body.password, saltRounds)
    // res.status(201).json(user)
  // } 
  // catch(error) {
    // return res.status(400).json({ error })
  // }
}
// if exists
const updateUser = async (req, res) => {
  

  // User.update(req.body, {
  //   where: {
  //     id: req.params.id
  //   }
  // })
  // .then(() => {
  //   res.json({ status: 'Updated' })
  // })
}
// if exists
const deleteUser = (req, res, next) => {

  User.destroy({
    where: {
      id: req.params.id
    }
  })
  .then((count) => {
    console.log(count)
    if (count === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json({ status: 'Deleted'})
  }).catch((e) => {
    const error = new Error(e.message);
    error.name = e.name;
    return next(error);
  })
}

module.exports = {
  getUser,
  deleteUser,
  addUser,
  updateUser
}