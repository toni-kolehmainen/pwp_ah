const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Ajv = require('ajv');
const { User } = require('../models');

const ajv = new Ajv({ coerceTypes: false });

const loginSchema = {
  type: 'object',
  properties: {
    email: { type: 'string' },
    password: { type: 'string' }
  },
  required: ['email', 'password'],
  additionalProperties: false
};

const login = async (req, res, next) => {
  if (!req.is('application/json')) {
    return res
      .status(415)
      .json({ error: 'Content-Type must be application/json' });
  }

  const validate = ajv.compile(loginSchema);
  const valid = validate(req.body);

  if (!valid) {
    const error = new Error('Invalid Request body');
    error.name = 'ValidationError';
    return next(error);
  }
  const userId = req.params.user_id;
  if (isNaN(userId)) {
    return res.status(500).json({
      error: 'invalid input syntax for type integer: "authentication"'
    });
  }
  try {
    const user = await User.findOne({
      where: {
        id: req.params.user_id
      }
    });
    if (!user) {
      return res.status(404).json({ error: 'user not found' });
    }

    const passwordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!(user.email === req.body.email && passwordValid)) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const userToken = {
      email: user.email,
      id: user.id
    };
    const token = jwt.sign(userToken, process.env.JWT, { expiresIn: 60 * 60 });
    return res.json({
      token,
      expiresIn: 60 * 60,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

module.exports = {
  login
};
