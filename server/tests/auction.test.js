const supertest = require('supertest');
const { dbSync, Auction } = require('../models');
const { sequelize } = require('../utils/db');
const app = require('../app');
const api = supertest(app);

// Mock express-rate-limit to bypass rate limiting during tests
jest.mock('express-rate-limit', () => jest.fn().mockImplementation(() => (req, res, next) => {
  next();
}));

// Mock middleware (e.g., authentication)
jest.mock('../utils/middleware', () => {
  const actualMiddleware = jest.requireActual('../utils/middleware');
  return {
    ...actualMiddleware,
    authenticateJWT: jest.fn((req, res, next) => {
      req.user = { id: 1, name: 'Test User' };
      next();
    })
  };
});

// Mock Sequelize models
jest.mock('../models', () => {
  const mockModel = {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    destroy: jest.fn()
  };
  return {
    User: mockModel,
    Item: mockModel,
    Auction: mockModel,
    Bid: mockModel,
    dbSync: jest.fn()
  };
});

// Setup and teardown
beforeAll(async () => {
  await dbSync();
  console.log('Database is synced before running tests');
});

afterAll(async () => {
  sequelize.close();
});

beforeEach(async () => {
  jest.clearAllMocks();
});

// Test GET /api/auctions
describe('GET /api/auctions', () => {
  it('should return all auctions (200)', async () => {
    const mockAuctions = [
      { id: 1, description: 'Laptop Auction', starting_price: 500.00 },
      { id: 2, description: 'Phone Auction', starting_price: 300.00 }
    ];
    Auction.findAll.mockResolvedValue(mockAuctions);

    const response = await api.get('/api/auctions').expect(200).expect('Content-Type', /application\/json/);
    expect(response.body).toEqual(mockAuctions);
  });

  it('should return an empty array when no auctions exist (204)', async () => {
    Auction.findAll.mockResolvedValue([]);

    const response = await api.get('/api/auctions').expect(204);
    expect(response.text).toBe('');
  });

  it('should handle null response from findAll (line 15)', async () => {
    Auction.findAll.mockResolvedValue(null);
    
    const response = await api.get('/api/auctions').expect(204);
    expect(response.text).toBe('');
  });

  it('should handle database errors in getAuctions (500)', async () => {
    Auction.findAll.mockRejectedValueOnce(new Error('Database error'));

    const response = await api.get('/api/auctions').expect(500);
    expect(response.body.error).toBe('Internal Server Error');
  });
});

// Test GET /api/auction/:id
describe('GET /api/auction/:id', () => {
  it('should return a specific auction (200)', async () => {
    const mockAuction = { id: 1, description: 'Laptop Auction', starting_price: 500.00 };
    Auction.findByPk.mockResolvedValue(mockAuction);

    const response = await api.get('/api/auction/1').expect(200).expect('Content-Type', /application\/json/);
    expect(response.body).toEqual(mockAuction);
  });

  it('should return 404 when auction is not found', async () => {
    Auction.findByPk.mockResolvedValue(null);

    const response = await api.get('/api/auction/999').expect(404);
    expect(response.body.error).toBe('Auction not found');
  });

  it('should return 500 when invalid ID format is passed', async () => {
    Auction.findByPk.mockRejectedValueOnce(new Error('Invalid ID'));

    const response = await api.get('/api/auction/invalid-id').expect(500);
    expect(response.body.error).toBe('Internal Server Error');
  });

  it('should handle database errors in getAuctionById (500)', async () => {
    Auction.findByPk.mockRejectedValueOnce(new Error('Database error'));

    const response = await api.get('/api/auction/1').expect(500);
    expect(response.body.error).toBe('Internal Server Error');
  });
});

// Test POST /api/auction
describe('POST /api/auction', () => {
  const mockAuction = {
    item_id: 1,
    desctription: 'Laptop Auction',
    starting_price: 500.00
  };

  const mockAuctionInvalid = {
    item_id: 1,
    desctription: 'Laptop Auction',
    starting_price: -100.00 // Invalid starting price
  };

  it('should create a new auction (201)', async () => {
    Auction.create.mockResolvedValue({
      id: 1,
      item_id: mockAuction.item_id,
      seller_id: 1,
      desctription: mockAuction.desctription,
      starting_price: mockAuction.starting_price,
      current_price: mockAuction.starting_price,
      end_time: new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
    });

    const response = await api
      .post('/api/auction')
      .set('Authorization', 'Bearer fakeToken')
      .send(mockAuction)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    expect(response.body.starting_price).toBe(mockAuction.starting_price);
    expect(response.body.seller_id).toBe(1);
  });

  it('should return 400 when invalid starting_price is provided', async () => {
    Auction.create.mockRejectedValueOnce({
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
    });

    const response = await api
      .post('/api/auction')
      .set('Authorization', 'Bearer fakeToken')
      .send(mockAuctionInvalid)
      .expect(400);

    expect(response.body.error).toContain('Validation min on starting_price failed');
  });

  it('should return 400 when required fields are missing', async () => {
    const invalidAuction = {};

    Auction.create.mockRejectedValueOnce({
      name: 'SequelizeValidationError',
      message: 'Validation error',
      errors: [
        { message: 'item_id cannot be null', path: 'item_id' },
        { message: 'starting_price cannot be null', path: 'starting_price' }
      ]
    });

    const response = await api
      .post('/api/auction')
      .set('Authorization', 'Bearer fakeToken')
      .send(invalidAuction)
      .expect(400);

    expect(response.body.error).toContain('Validation error');
  });

  it('should return 400 when item_id does not exist', async () => {
    Auction.create.mockRejectedValueOnce({
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
    });

    const response = await api
      .post('/api/auction')
      .set('Authorization', 'Bearer fakeToken')
      .send({ item_id: 999, starting_price: 500.00 })
      .expect(400);

    expect(response.body.error).toContain('Invalid item_id');
  });

  it('should handle unexpected errors in addAuction (500)', async () => {
    Auction.create.mockRejectedValueOnce(new Error('Database error'));

    const response = await api
      .post('/api/auction')
      .set('Authorization', 'Bearer fakeToken')
      .send({ item_id: 1, starting_price: 500.00 })
      .expect(500);

    expect(response.body.error).toBe('Internal Server Error');
  });

  it('should handle invalid starting_price format (400)', async () => {
    const invalidAuction = { item_id: 1, starting_price: 'not-a-number' };

    Auction.create.mockRejectedValueOnce({
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
    });

    const response = await api
      .post('/api/auction')
      .set('Authorization', 'Bearer fakeToken')
      .send(invalidAuction)
      .expect(400);

    expect(response.body.error).toContain('Validation isDecimal on starting_price failed');
  });

  it('should handle empty request body in POST (400)', async () => {
    Auction.create.mockRejectedValueOnce({
      name: 'SequelizeValidationError',
      message: 'Validation error',
      errors: [
        { message: 'item_id cannot be null', path: 'item_id' },
        { message: 'starting_price cannot be null', path: 'starting_price' }
      ]
    });

    const response = await api
      .post('/api/auction')
      .set('Authorization', 'Bearer fakeToken')
      .send({})
      .expect(400);

    expect(response.body.error).toContain('Validation error');
  });
});

// Test DELETE /api/auction/:id
describe('DELETE /api/auction/:id', () => {
  it('should delete an auction successfully (200)', async () => {
    const mockDestroy = jest.fn().mockResolvedValue(1);
    
    const mockAuction = { 
      id: 1,
      destroy: mockDestroy
    };
    
    Auction.findByPk.mockResolvedValue(mockAuction);
  
    const response = await api
      .delete('/api/auction/1')
      .set('Authorization', 'Bearer fakeToken')
      .expect(200);
  
    expect(response.body.message).toBe('Auction deleted successfully');
    expect(mockDestroy).toHaveBeenCalled();
  });

  it('should return 404 when auction is not found', async () => {
    Auction.findByPk.mockResolvedValue(null);

    const response = await api
      .delete('/api/auction/999')
      .set('Authorization', 'Bearer fakeToken')
      .expect(404);

    expect(response.body.error).toBe('Auction not found');
  });

  it('should return 500 when invalid ID format is passed', async () => {
    Auction.findByPk.mockRejectedValueOnce(new Error('Invalid ID'));

    const response = await api
      .delete('/api/auction/invalid-id')
      .set('Authorization', 'Bearer fakeToken')
      .expect(500);

    expect(response.body.error).toBe('Internal Server Error');
  });

  it('should handle unexpected errors in deleteAuction (500)', async () => {
    Auction.findByPk.mockResolvedValue({ id: 1 });
    Auction.destroy.mockRejectedValueOnce(new Error('Database error'));

    const response = await api
      .delete('/api/auction/1')
      .set('Authorization', 'Bearer fakeToken')
      .expect(500);

    expect(response.body.error).toBe('Internal Server Error');
  });
});

// Test DELETE /api/auctions
describe('DELETE /api/auctions', () => {
  it('should delete all auctions successfully (200)', async () => {
    Auction.destroy.mockResolvedValue(true);

    const response = await api
      .delete('/api/auctions')
      .set('Authorization', 'Bearer fakeToken')
      .expect(200);

    expect(response.body.message).toBe('All auctions deleted successfully');
  });

  it('should handle database errors in deleteAuctions (500)', async () => {
    Auction.destroy.mockRejectedValueOnce(new Error('Database error'));

    const response = await api
      .delete('/api/auctions')
      .set('Authorization', 'Bearer fakeToken')
      .expect(500);

    expect(response.body.error).toBe('Internal Server Error');
  });
});