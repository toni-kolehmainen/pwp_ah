const logger = require('./logger')
const rateLimit = require('express-rate-limit');

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'SequelizeDatabaseError') {
    return response.status(500).json({ error: error.message })
  }
  next(error)
}

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // Limit to 5 requests per windowMs
  message: "Too many requests, please try again later.",
  keyGenerator: (req) => 'test-key',
});

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  limiter
}