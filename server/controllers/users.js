const Ajv = require('ajv');
const bcrypt = require('bcrypt');
const { User } = require('../models');

const ajv = new Ajv({ coerceTypes: false });
const { createHalLinks } = require('../utils/hal');
const { getResource } = require('./get/base_resource');

// The schema for adding a new user
const addSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    nickname: { type: 'string' },
    email: { type: 'string' },
    phone: { type: 'string' },
    password: { type: 'string' }
  },
  required: ['name', 'email', 'phone', 'password'],
  additionalProperties: false
};

const getUsers = async (req, res, next) => {
  // Find a users in the database excluding the password field

  await getResource(
    {
      model: User,
      where: {},
      attributes: { exclude: ['password'] }
    },
    {
      self: '/api/user/',
      path: 'users',
      edit: true
    },
    res,
    next
  );

  // const users = await User.findAll({
  //   attributes: { exclude: ['password'] }
  // });

  // // If users length is 0, return a 204 No content
  // if (users.length === 0) {
  //   return res.status(204).end();
  // }
  // console.log(users);
  // // Else return users
  // return res.json({
  //   _links:
  //     {
  //       self: { href: '/api/users/' },
  //       profile: { href: '/profiles/users/' },
  //       create: { href: '/api/users', method: 'POST' }
  //     },
  //   _embedded: {
  //     users: users.map((user) => createHalEmbedded(user.toJSON(), 'users'))
  //   }
  // });
};

const addUser = async (req, res, next) => {
  try {
    console.log(req.body);
    // Validate the request body using the addSchema and ajv
    const validate = ajv.compile(addSchema);
    const valid = validate(req.body);

    // If validation fails, return a validation error
    if (!valid) {
      const error = new Error('Invalid Request body');
      error.name = 'ValidationError';
      return next(error);
    }
    // Hash the password before saving to the database
    const saltRounds = 10;
    const password = await bcrypt.hash(req.body.password, saltRounds);
    req.body = { ...req.body, password };

    // Create a new user in the database
    const user = await User.create(req.body);
    return res.status(201).json(createHalLinks(user.toJSON(), 'users'));
  } catch (e) {
    console.log(e);
    // If an error occurs, handle the error
    const error = new Error(e.message);
    error.name = e.name;
    // If the error has validation messages
    error.message = e.errors[0]?.message || error.message;
    return next(error); // Pass the error to the next middleware (error handler)
  }
};

module.exports = {
  getUsers, addUser
};
