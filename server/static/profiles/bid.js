const bidProperties = {
  id: {
    type: 'integer',
    description: 'The unique identifier for the bid.'
  },
  amount: {
    type: 'number',
    description: 'The amount of the bid.',
    format: 'decimal',
    minimum: 0
  },
  created_at: {
    type: 'string',
    description: 'The date and time when the bid was created.',
    format: 'date-time'
  },
  updated_at: {
    type: 'string',
    description: 'The date and time when the bid was last updated.',
    format: 'date-time'
  }
};

module.exports = bidProperties;
