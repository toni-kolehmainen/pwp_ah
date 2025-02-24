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

const updateSchema = {
  type: "object",
  properties: {
    name: {type: "string"},
    nickname: {type: "string"},
    email: {type: "string"},
    phone: {type: "string", },
    password: {type: "string"},
  },
  minProperties: 1,
  maxProperties: 1,
  additionalProperties: false
}

const getUser = async (req, res, next) => {

  User.findOne({
    where:{
      id: req.params.user_id
    }
  }).then((user)=>{
    if (!user) {
        return res.status(404).end()
      }
    res.json(user)
  }).catch((e)=>{
    const error = new Error(e.message);
    error.name = e.name
    return next(error)
  })
}

const addUser = async (req, res, next) => {
    const validate = ajv.compile(addSchema)
    const valid = validate(req.body)

    if (!valid) {
      const error = new Error('Invalid Request body')
      error.name = 'ValidationError'
      return next(error)
    }
    const saltRounds = 10
    const password = await bcrypt.hash(req.body.password, saltRounds)
    req.body = {...req.body, password:password}

    User.create(req.body).then((user)=>{
      res.status(201).json(user)

    }).catch((e)=>{
      const error = new Error(e.message);
      error.name = e.name;
      if (e.errors.length != 0) {
        error.message = e.errors[0].message
      }
      return next(error)
    })
}
// if exists
const updateUser = async (req, res, next) => {

  const validate = ajv.compile(updateSchema)
  const valid = validate(req.body)

  if (!valid) {
    const error = new Error('Invalid Request body')
    error.name = 'ValidationError'
    return next(error)
  }
  if ("password" in req.body) {
    const saltRounds = 10
    const password = await bcrypt.hash(req.body.password, saltRounds)
    req.body = {...req.body, password:password}
  }
  User.update(req.body, {
    where: {
      id: req.params.user_id
    }
  }).then(() => {
    res.json({ status: 'Updated' })
  }).catch((e)=>{
    const error = new Error(e.message)
    error.name = e.name
    return next(error)
  })
}
// if exists
const deleteUser = (req, res, next) => {

  User.destroy({
    where: {
      id: req.params.user_id
    }
  }).then((count) => {
    console.log(count)
    if (count === 0) {
      return res.status(404).json({ error: 'User not found' })
    }
    res.json({ status: 'Deleted'})
  }).catch((e) => {
    const error = new Error(e.message)
    error.name = e.name
    return next(error)
  })
}

module.exports = {
  getUser,
  deleteUser,
  addUser,
  updateUser
}