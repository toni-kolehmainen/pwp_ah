const schemas = {
    auctionCreate: {
      type: 'object',
      properties: {
        item_id: { type: 'integer', minimum: 1 }, // Positive integer ID
        description: { type: 'string', maxLength: 1000 },
        starting_price: { type: 'number', minimum: 0.01 }, // Ensure positive price
        end_time: { 
          type: 'string', 
          format: 'date-time', 
          nullable: true 
        } // ISO date string or null
      },
      required: ['item_id', 'starting_price'],
      additionalProperties: false
    },
    
    auctionId: {
      type: 'object',
      properties: {
        id: { type: 'integer', minimum: 1 }
      },
      required: ['id'],
      additionalProperties: false
    },
    
    auctionsQuery: {
      type: 'object',
      properties: {
        limit: { type: 'integer', minimum: 1, maximum: 100 },
        offset: { type: 'integer', minimum: 0 },
        sort: { type: 'string', enum: ['end_time', 'current_price', 'starting_price'] },
        order: { type: 'string', enum: ['ASC', 'DESC'] }
      },
      additionalProperties: false
    }
  };
  
module.exports = schemas;