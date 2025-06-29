const jwt = require('jsonwebtoken');
const logger = require('./logger');
const { cacheMiddleware } = require('./cacheMiddleware');

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method);
  logger.info('Path:  ', request.path);
  logger.info('Body:  ', request.body);
  logger.info('---');
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, request, response, next) => {
  console.log('In error handler:');
  console.log('In error handler:', error); // Log the error to ensure it's being passed
  if (error.name === 'CastError') {
    return response.status(400).json({ error: 'malformatted id' });
  }
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }
  if (error.name === 'SequelizeDatabaseError') {
    return response.status(500).json({ error: error.message });
  }
  if (error.name === 'SequelizeUniqueConstraintError') {
    return response.status(409).json({ error: error.message });
  }
  if (error.name === 'SequelizeValidationError') {
    return response.status(400).json({ error: error.message });
  } if (error.name === 'SequelizeForeignKeyConstraintError') {
    return response.status(400).json({ error: error.message });
  }

  return next(error);
};

const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }
  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  authenticateJWT,
  cacheMiddleware
};
