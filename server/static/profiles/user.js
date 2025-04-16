const userProperties = {
  id: {
    type: 'integer',
    description: 'The unique identifier for a user.'
  },
  name: {
    type: 'string',
    description: 'The name of the user.',
    maxLength: 20
  },
  nickname: {
    type: 'string',
    description: 'The nickname of the user (optional).',
    maxLength: 20
  },
  email: {
    type: 'string',
    description: 'The email address of the user.',
    format: 'email',
    maxLength: 50
  },
  phone: {
    type: 'string',
    description: 'The phone number of the user.',
    maxLength: 20
  }
};

module.exports = userProperties;
