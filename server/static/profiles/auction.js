const auctionProperties = {
  id: {
    type: 'integer',
    description: 'The unique identifier for the auction.'
  },
  description: {
    type: 'string',
    description: 'A detailed description of the auction item.',
    maxLength: 1000
  },
  item_id: {
    type: 'integer',
    description: 'The ID of the item being auctioned.',
    format: 'int64'
  },
  seller_id: {
    type: 'integer',
    description: 'The ID of the seller who created the auction.',
    format: 'int64'
  },
  end_time: {
    type: 'string',
    description: 'The date and time when the auction ends.',
    format: 'date-time'
  },
  starting_price: {
    type: 'number',
    description: 'The starting price of the auction item.',
    format: 'decimal',
    minimum: 0.00
  },
  current_price: {
    type: 'number',
    description: 'The current price of the auction item.',
    format: 'decimal',
    minimum: 0.00
  },
  created_at: {
    type: 'string',
    description: 'The date and time when the auction was created.',
    format: 'date-time'
  },
  updated_at: {
    type: 'string',
    description: 'The date and time when the auction was last updated.',
    format: 'date-time'
  }
};

module.exports = auctionProperties;
