const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const ajv = new Ajv({ allErrors: true });
addFormats(ajv); // Add support for additional formats

/**
 * Middleware factory for validating request data against a JSON schema
 * @param {Object} schema - The JSON schema to validate against
 * @param {String} property - The request property to validate (body, params, query)
 * @returns {Function} Express middleware function
 */
const validate = (schema, property) => {
  return (req, res, next) => {
    const data = req[property];
    const validate = ajv.compile(schema);
    const valid = validate(data);
    
    if (!valid) {
      const errors = validate.errors.map(error => {
        return {
          path: error.instancePath || '',
          message: error.message,
          params: error.params
        };
      });
      
      return res.status(400).json({
        error: 'Validation Error',
        details: errors
      });
    }
    
    next();
  };
};

module.exports = { validate };