const supertest = require('supertest');
const { dbSync, Auction } = require('../models'); // Import models
const { sequelize } = require('../utils/db'); // Import Sequelize instance
const app = require('../app'); // Import Express app
const api = supertest(app);

// Mock validation middleware to pass through during tests
jest.mock('../utils/validation', () => ({
  validate: () => (req, res, next) => next() // Skip validation in tests
}));

// Mock express-rate-limit to bypass rate limiting during tests
jest.mock('express-rate-limit', () => jest.fn().mockImplementation(() => (req, res, next) => {
  next(); // Proceed to the next middleware or controller
}));

// Mock middleware (e.g., authentication)
jest.mock('../utils/middleware', () => {
  const actualMiddleware = jest.requireActual('../utils/middleware'); // Keep other middleware if needed
  return {
    ...actualMiddleware,
    authenticateJWT: jest.fn((req, res, next) => {
      req.user = { id: 1, name: 'Test User' }; // Fake authenticated user
      next(); // Proceed to the next middleware/controller
    })
  };
});

// Mock Sequelize models with individual mock implementation for each test
jest.mock('../models', () => {
  // Create mock functions
  const findAll = jest.fn();
  const findByPk = jest.fn();
  const create = jest.fn();
  const destroy = jest.fn();

  // Create mock models with these functions
  const mockAuction = {
    findAll,
    findByPk,
    create,
    destroy
  };

  return {
    User: { findAll: jest.fn(), findByPk: jest.fn(), create: jest.fn(), destroy: jest.fn() },
    Item: { findAll: jest.fn(), findByPk: jest.fn(), create: jest.fn(), destroy: jest.fn() },
    Auction: mockAuction,
    Bid: { findAll: jest.fn(), findByPk: jest.fn(), create: jest.fn(), destroy: jest.fn() },
    dbSync: jest.fn()
  };
});

// Mock the Item and User models that are used in includes
jest.mock('../models/item', () => ({}));
jest.mock('../models/user', () => ({}));

// Sync database before running tests
beforeAll(async () => {
  await dbSync();
  console.log('Database is synced before running tests');
});

afterAll(async () => {
  await sequelize.close();
});

// Clean up the Auction model before each test
beforeEach(() => {
  jest.clearAllMocks();
});

// Test GET /api/auctions

describe('GET /api/auctions', () => {
  beforeEach(async () => {
    // Clean up the User model before each test
    jest.clearAllMocks();
    await Auction.destroy({ where: {}, truncate: true });
  });

  it('should return an empty array when no auctions exist (204)', async () => {
    Auction.findAll.mockResolvedValue([]);

    const response = await api.get('/api/auctions').expect(204);
    expect(response.text).toBe(''); // No content should return an empty response
  });

  it('should handle null response from findAll', async () => {
    Auction.findAll.mockResolvedValue(null);

    const response = await api.get('/api/auctions').expect(204);
    expect(response.text).toBe(''); // No content should return an empty response
  });

  
  it('should return all auctions (200)', async () => {
    const mockAuctions = [
      { 
        id: 1, 
        description: 'Laptop Auction', 
        starting_price: 500.00,
        toJSON: jest.fn().mockReturnValue({
          id: 1, 
          description: 'Laptop Auction', 
          starting_price: 500.00,
        })
      },
      { 
        id: 2, 
        description: 'Phone Auction', 
        starting_price: 300.00,
        toJSON: jest.fn().mockReturnValue({
          id: 2, 
          description: 'Phone Auction', 
          starting_price: 300.00,
        })
      }
    ];
    Auction.findAll.mockResolvedValue(mockAuctions);

    const response = await api.get('/api/auctions').expect(200).expect('Content-Type', /application\/json/);
    const body = response.body;

    // Check for _links
    expect(body).toHaveProperty('_links');
    expect(body._links).toHaveProperty('self');
    expect(body._links).toHaveProperty('create');
    expect(body._links.create).toHaveProperty('href', '/api/auctions');
    expect(body._links.profile).toHaveProperty('href', '/profiles/auctions/');

    // Check for _embedded and embedded users array
    expect(body).toHaveProperty('_embedded');
    expect(body._embedded).toHaveProperty('auctions');
    expect(Array.isArray(body._embedded.auctions)).toBe(true);
    for (let i=0; i<body._embedded.auctions.lenght; i++) {
      // Check for the properties of the first user in the embedded array
      const auction = body._embedded.auctions[i];
      expect(auction).toHaveProperty('_links');
      expect(auction._links).toHaveProperty('self');
      expect(auction._links.self).toHaveProperty('href', `/api/auctions/${mockAuctions[i].id}`);
      
      // Verify that user has 'email', 'name', and 'nickname'
      expect(auction).toHaveProperty('description');
      expect(auction).toHaveProperty('starting_price');
      
      // Ensure 'href' for delete and edit are present
      expect(auction._links).toHaveProperty('delete');
      expect(auction._links.delete).toHaveProperty('href', `/api/auctions/${mockAuctions[i].id}`);
    }
  });
});

// Test GET /api/auction/:id
describe('GET /api/auction/:id', () => {


  it('should return a specific auction (200)', async () => {
    const mockAuction = { 
      id: 1, 
      description: 'Laptop Auction', 
      starting_price: 500.00,
      item: { id: 1, name: 'Laptop' },
      seller: { id: 1, name: 'Test User' },
      toJSON: jest.fn().mockReturnValue({
        id: 1, 
        description: 'Laptop Auction', 
        starting_price: 500.00,
        item: { id: 1, name: 'Laptop' },
        seller: { id: 1, name: 'Test User' },
      })
    };
    Auction.findByPk.mockResolvedValue(mockAuction);

    const response = await api.get('/api/auctions/1').expect(200).expect('Content-Type', /application\/json/);
    const body = response.body;
    expect(body).toHaveProperty('_links');
    expect(body._links).toHaveProperty('self');
    expect(body._links.self).toHaveProperty('href', `/api/auctions/${mockAuction.id}`);
    expect(body._links).toHaveProperty('delete');
    expect(body._links.delete).toHaveProperty('href', `/api/auctions/${mockAuction.id}`, "method", "DELETE");
    expect(body._links).toHaveProperty('profile');
    expect(body._links.profile).toHaveProperty('href', '/profiles/auctions');
    expect(body._links).toHaveProperty('all');
    expect(body._links.all).toHaveProperty('href', '/api/auctions');
    
    // check for data values mathcing the mockUser
    expect(body).toHaveProperty('description', mockAuction.description);
    expect(body).toHaveProperty('starting_price', mockAuction.starting_price);
    expect(body).toHaveProperty('item', mockAuction.item);
    expect(body).toHaveProperty('seller', mockAuction.seller);
  });

  it('should return 404 when auction is not found', async () => {
    Auction.findByPk.mockResolvedValue(null);

    const response = await api.get('/api/auctions/999').expect(404);
    expect(response.body.error).toBe('Auction not found');
  });

  it('should return 500 when invalid ID format is passed', async () => {
    Auction.findByPk.mockRejectedValue(new Error('Invalid ID'));

    const response = await api.get('/api/auctions/invalid-id').expect(500);
    expect(response.body.error).toBe('Internal Server Error');
  });
});

// Test POST /api/auction
describe('POST /api/auctions', () => {
  const mockAuction = {
    item_id: 1,
    description: 'Laptop Auction',
    starting_price: 500.00
  };

  const mockAuctionInvalid = {
    item_id: 1,
    description: 'Laptop Auction',
    starting_price: -100.00 // Invalid starting price
  };

  it('should create a new auction (201)', async () => {
    const createdAuction = {
      id: 1,
      item_id: mockAuction.item_id,
      seller_id: 1, // Seller ID from mocked authentication
      description: mockAuction.description,
      starting_price: mockAuction.starting_price,
      current_price: mockAuction.starting_price,
      toJSON: jest.fn().mockReturnValue({
        id: 1,
        item_id: mockAuction.item_id,
        seller_id: 1, // Seller ID from mocked authentication
        description: mockAuction.description,
        starting_price: mockAuction.starting_price,
        current_price: mockAuction.starting_price,
      })
    };
    
    Auction.create.mockResolvedValue(createdAuction);

    const response = await api
      .post('/api/auctions')
      .set('Authorization', 'Bearer fakeToken')
      .send(mockAuction)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    expect(response.body.starting_price).toBe(mockAuction.starting_price);
    expect(response.body.seller_id).toBe(1); // Seller ID from mocked authentication
  });

  it('should return 400 when invalid starting_price is provided', async () => {
    const validationError = {
      name: 'SequelizeValidationError',
      message: 'Validation min on starting_price failed',
      errors: [
        {
          message: 'Validation min on starting_price failed',
          type: 'Validation error',
          path: 'starting_price',
          value: mockAuctionInvalid.starting_price
        }
      ]
    };
    
    Auction.create.mockRejectedValue(validationError);
  
    const response = await api
      .post('/api/auctions')
      .set('Authorization', 'Bearer fakeToken')
      .send(mockAuctionInvalid)
      .expect(400);
  
    // Update expectation to match controller's error message format
    expect(response.body.error).toBe(validationError.message);
  });

  it('should return 400 when required fields are missing', async () => {
    const invalidAuction = {}; // Missing required fields
    const validationError = {
      name: 'SequelizeValidationError',
      message: 'Validation error',
      errors: [
        { message: 'item_id cannot be null', path: 'item_id' },
        { message: 'starting_price cannot be null', path: 'starting_price' }
      ]
    };
    
    Auction.create.mockRejectedValue(validationError);
  
    const response = await api
      .post('/api/auctions')
      .set('Authorization', 'Bearer fakeToken')
      .send(invalidAuction)
      .expect(400);
  
    // Update expectation to match controller's error message format
    expect(response.body.error).toBe(validationError.message);
  });

  it('should return 400 when item_id does not exist', async () => {
    const foreignKeyError = {
      name: 'SequelizeForeignKeyConstraintError',
      message: 'Invalid item_id',
      errors: [
        {
          message: 'Invalid item_id',
          type: 'Foreign key constraint error',
          path: 'item_id',
          value: null
        }
      ]
    };
    
    Auction.create.mockRejectedValue(foreignKeyError);

    const response = await api
      .post('/api/auctions')
      .set('Authorization', 'Bearer fakeToken')
      .send({ item_id: 999, starting_price: 500.00 })
      .expect(400);

    // Update expectation to match controller's error message format
    expect(response.body.error).toBe(foreignKeyError.message);
  });

  it('should handle unexpected errors in addAuction (500)', async () => {
    Auction.create.mockRejectedValue(new Error('Database error'));

    const response = await api
      .post('/api/auctions')
      .set('Authorization', 'Bearer fakeToken')
      .send({ item_id: 1, starting_price: 500.00 })
      .expect(500);

    expect(response.body.error).toBe('Internal Server Error');
  });

  it('should handle invalid starting_price format (400)', async () => {
    const invalidAuction = { item_id: 1, starting_price: 'not-a-number' };
    const validationError = {
      name: 'SequelizeValidationError',
      message: 'Validation isDecimal on starting_price failed',
      errors: [
        {
          message: 'Validation isDecimal on starting_price failed',
          type: 'Validation error',
          path: 'starting_price',
          value: invalidAuction.starting_price
        }
      ]
    };
    
    Auction.create.mockRejectedValue(validationError);

    const response = await api
      .post('/api/auctions')
      .set('Authorization', 'Bearer fakeToken')
      .send(invalidAuction)
      .expect(400);

    // Update expectation to match controller's error message format
    expect(response.body.error).toBe(validationError.message);
  });

  it('should handle empty request body in POST (400)', async () => {
    const validationError = {
      name: 'SequelizeValidationError',
      message: 'Validation error',
      errors: [
        { message: 'item_id cannot be null', path: 'item_id' },
        { message: 'starting_price cannot be null', path: 'starting_price' }
      ]
    };
    
    Auction.create.mockRejectedValue(validationError);
  
    const response = await api
      .post('/api/auctions')
      .set('Authorization', 'Bearer fakeToken')
      .send({})
      .expect(400);
  
    // Update expectation to match controller's error message format
    expect(response.body.error).toBe(validationError.message);
  });
});

// Test DELETE /api/auction/:id
describe('DELETE /api/auctions/:id', () => {
  it('should delete an auction successfully (200)', async () => {
    // Create a mock auction that includes the seller_id matching the authenticated user
    const mockAuction = {
      id: 1,
      seller_id: 1, // This matches our authenticated user ID
      destroy: jest.fn().mockResolvedValue(1)
    };
    
    Auction.findByPk.mockResolvedValue(mockAuction);
  
    const response = await api
      .delete('/api/auctions/1')
      .set('Authorization', 'Bearer fakeToken')
      .expect(200);
  
    expect(response.body.message).toBe('Deleted successfully from auctions');
    expect(mockAuction.destroy).toHaveBeenCalled();
  });
  
  it('should return 404 when auction is not found', async () => {
    Auction.findByPk.mockResolvedValue(null); // Mock non-existing auction

    const response = await api
      .delete('/api/auctions/999')
      .set('Authorization', 'Bearer fakeToken')
      .expect(404);

    expect(response.body.error).toBe('Auction not found');
  });

  it('should return 500 when invalid ID format is passed', async () => {
    Auction.findByPk.mockRejectedValue(new Error('Invalid ID'));

    const response = await api
      .delete('/api/auctions/invalid-id')
      .set('Authorization', 'Bearer fakeToken')
      .expect(500);

    expect(response.body.error).toBe('Internal Server Error');
  });

  it('should handle authorization errors in deleteAuction (403)', async () => {
    // Mock a scenario where the user doesn't own the auction
    const mockAuction = {
      id: 1,
      seller_id: 2, // Different from the authenticated user ID (which is 1)
      destroy: jest.fn()
    };
    
    Auction.findByPk.mockResolvedValue(mockAuction);
    
    const response = await api
      .delete('/api/auctions/1')
      .set('Authorization', 'Bearer fakeToken')
      .expect(403);

    expect(response.body.error).toBe('Not authorized to delete this auction');
    expect(mockAuction.destroy).not.toHaveBeenCalled(); // Ensure destroy was not called
  });

  it('should handle unexpected errors in deleteAuction (500)', async () => {
    const mockAuction = {
      id: 1,
      seller_id: 1,
      destroy: jest.fn().mockRejectedValue(new Error('Database error'))
    };
    
    Auction.findByPk.mockResolvedValue(mockAuction);

    const response = await api
      .delete('/api/auctions/1')
      .set('Authorization', 'Bearer fakeToken')
      .expect(500);

    expect(response.body.error).toBe('Internal Server Error');
  });
});

describe('GET /api/auctions errors', () => {
  beforeEach(async () => {
    // Clean up the User model before each test
    jest.clearAllMocks();
    await Auction.destroy({ where: {}, truncate: true });
  });

  it('should handle database errors in getAuctions (500)', async () => {
    Auction.findAll.mockRejectedValueOnce(new Error('Database error'));

    const response = await api.get('/api/auctions').expect(500);
    expect(response.body.error).toBe('Internal Server Error');
  });
  it('should handle database errors in getAuctionById (500)', async () => {
    Auction.findByPk.mockRejectedValue(new Error('Database error'));

    const response = await api.get('/api/auctions/1').expect(500);
    expect(response.body.error).toBe('Internal Server Error');
  });
});