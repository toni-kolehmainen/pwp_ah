const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const ajv = new Ajv({ allErrors: true });
addFormats(ajv); // Add support for additional formats


const validate = (schema, property) => (req, res, next) => {
  const data = req[property];
  console.log("validations is going on",data);
  
  if (property === 'params' && data.id) {
    const parsedId = parseInt(data.id, 10);
    if (!isNaN(parsedId)) {
      data.id = parsedId;
    }
  }
    console.log("validations after going on",data);

  const validate = ajv.compile(schema);
  const valid = validate(data);
  console.log("validations is going on valid ",valid);

  if (!valid) {
    const errors = validate.errors.map((error) => ({
      path: error.instancePath || '',
      message: error.message,
      params: error.params
    }));

    return res.status(400).json({
      error: 'Validation Error',
      details: errors
    });
  }

  next();
};

module.exports = { validate };
