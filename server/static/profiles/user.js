const userProperties = {
  id: {
    type: 'integer',
    description: 'The unique identifier for a user.'
  },
  name: {
    type: 'string',
    description: 'The name of the user.'
  },
  nickname: {
    type: 'string',
    description: 'The nickname of the user (optional).'
  },
  email: {
    type: 'string',
    description: 'The email address of the user.',
    format: 'email'
  },
  phone: {
    type: 'string',
    description: 'The phone number of the user.'
  },
  created_at: {
    type: 'string',
    description: 'The date when the user account was created.',
    format: 'date-time'
  }
};

module.exports = userProperties;
