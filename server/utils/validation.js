const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const ajv = new Ajv({ coerceTypes: true, allErrors: true });
addFormats(ajv); // Add support for additional formats

const validate = (schema, property) => (req, res, next) => {
  const data = req[property];
  console.log('validations is going on', data);

  if (property === 'params' && data.id) {
    const parsedId = parseInt(data.id, 10);
    if (!Number.isNaN(parsedId)) {
      data.id = parsedId;
    }
  }
  console.log('validations after going on', data);

  const validateSchema = ajv.compile(schema);
  const valid = validateSchema(data);
  console.log('validations is going on valid ', valid);

  if (!valid) {
    const errors = validateSchema.errors.map((error) => ({
      path: error.instancePath || '',
      message: error.message,
      params: error.params
    }));

    return res.status(400).json({
      error: 'Validation Error',
      details: errors
    });
  }

  return next();
};

module.exports = { validate };
