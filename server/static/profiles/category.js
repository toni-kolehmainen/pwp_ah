const categoryProperties = {
  id: {
    type: 'integer',
    description: 'The unique identifier for the category.'
  },
  description: {
    type: 'string',
    description: 'A description of the category.'
  },
  name: {
    type: 'string',
    description: 'The name of the category.',
    maxLength: 100
  }
};

module.exports = categoryProperties;
