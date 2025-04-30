const itemProperties = {
  id: {
    type: 'integer',
    description: 'The unique identifier for the item.'
  },
  name: {
    type: 'string',
    description: 'The name of the item.',
    maxLength: 100
  },
  description: {
    type: 'string',
    description: 'A detailed description of the item.'
  },
  user_id: {
    type: 'integer',
    description: 'The unique identifier for the user who owns the item.',
    format: 'int64'
  },
  category_id: {
    type: 'integer',
    description: 'The unique identifier for the category the item belongs to.',
    format: 'int64'
  }
};

module.exports = itemProperties;
