const bcrypt = require('bcrypt');
const Ajv = require('ajv');
const { User } = require('../models');

const ajv = new Ajv({ coerceTypes: false });
const { createHalLinks, deleteHalLinks, putHalLinks } = require('../utils/hal');

const updateSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    nickname: { type: 'string' },
    email: { type: 'string' },
    phone: { type: 'string' },
    password: { type: 'string' }
  },
  minProperties: 1,
  maxProperties: 1,
  additionalProperties: false
};

const getUser = async (req, res, next) => {
  // Find a user in the database based on the provided user ID
  User.findOne({
    where: {
      id: req.params.user_id
    },
    attributes: { exclude: ['password'] }
  }).then((user) => {
    // If no user is found, return a 404 Not Found response
    if (!user) {
      return res.status(404).end();
    }
    // If user exists, respond with user data and hypermedia
    return res.json(createHalLinks(user.toJSON(), 'users'));
  }).catch((e) => {
    // If an error occurs, create a new error object and pass it to the error handler
    const error = new Error(e.message);
    error.name = e.name;
    return next(error); // Pass error to Express error handling middleware
  });
};

const updateUser = async (req, res, next) => {
  try {
    // Validate the request body using the updateSchema
    const validate = ajv.compile(updateSchema);
    const valid = validate(req.body);

    // If the validation fails, return a validation error
    if (!valid) {
      const error = new Error('Invalid Request body');
      error.name = 'ValidationError';
      return next(error); // Pass the error to the next middleware
    }
    // Check if a password is included in the update request
    if ('password' in req.body) {
      const saltRounds = 10;
      const password = await bcrypt.hash(req.body.password, saltRounds);
      req.body = { ...req.body, password };
    }
    // Update the user in the database based on the user ID from the request params
    const [updatedRows, updatedUsers] = await User.update(req.body, {
      where: {
        id: req.params.user_id
      },
      attributes: { exclude: ['password'] },
      returning: true
    });
    console.log('update');
    console.log(updatedRows);
    console.log(updatedUsers);
    // Return a success response indicating the user was updated
    return res.json(putHalLinks(updatedUsers[0].toJSON(), 'users'));
  } catch (e) {
    // If an error occurs, create a new error object with the error's message
    const error = new Error(e.message);
    error.name = e.name;
    return next(error); // Pass the error to the next middleware for centralized error handling
  }
};

const deleteUser = (req, res, next) => {
  // Delete the user from the database based on the user ID
  User.destroy({
    where: {
      id: req.params.user_id
    }
  }).then((count) => {
    // If no user was deleted (i.e., count is 0), return a 404 Not Found response
    if (count === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Else the deletion is successful, return a response indicating the user was deleted
    return res.json(deleteHalLinks('users'));
  }).catch((e) => {
    // If an error occurs during the deletion process, catch and handle it
    const error = new Error(e.message);
    error.name = e.name;
    return next(error); // Pass the error to the next middleware (error handler)
  });
};

module.exports = {
  getUser,
  deleteUser,
  updateUser
};
