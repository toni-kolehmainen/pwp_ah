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
  buy_time: {
    type: 'string',
    description: 'The date and time when the bid was created.',
    format: 'date-time'
  },
  auction_id: {
    type: 'integer',
    description: 'The unique identifier for the auction the bid belongs to.',
    format: 'int64'
  },
  buyer_id: {
    type: 'integer',
    description: 'The unique identifier for the user who bids the item.',
    format: 'int64'
  }
};

module.exports = bidProperties;
