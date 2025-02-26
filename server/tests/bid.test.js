const supertest = require('supertest');
const { dbSync, Bid } = require('../models'); // models
const { sequelize } = require('../utils/db'); // Import sequelize
const app = require('../app');
// Import Express app
const api = supertest(app);
const { authenticateJWT } = require('../utils/middleware');

const mockBid = {
  amount: 500,
  buyer_id: 1,
  auction_id: 1
};
const mockBidInvalid = {
  amount: -1,
  buyer_id: 1,
  auction_id: 1
};
const mockBidInvalid1 = {
  amount: -1,
  auction_id: 1
};
jest.mock('express-rate-limit', () => jest.fn().mockImplementation(() => (req, res, next) => {
  next(); // Mocking the rate-limiting middleware without enforcing limits
}));

jest.mock('../utils/middleware', () => {
  const actualMiddleware = jest.requireActual('../utils/middleware'); // Keep other middleware if needed
  return {
    ...actualMiddleware, // Retain other middleware exports
    authenticateJWT: jest.fn((req, res, next) => {
      req.user = { id: 1, name: 'Test User' }; // Fake authenticated user
      next(); // Proceed to the next middleware/controller
    })
  };
});

jest.mock('../models', () => {
  const mockModel = {
    findAll: jest.fn(), // Return the mock user
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(), // Assuming one row updated
    destroy: jest.fn() // Assuming one row deleted
  };

  return {
    User: mockModel,
    Item: mockModel,
    Category: mockModel,
    Auction: mockModel,
    Bid: mockModel,
    dbSync: jest.fn()
  };
});

// You need to wait for the database models to create.
beforeAll(async () => {
  await dbSync();
  console.log('Database is synced before running tests');
});

afterAll(async () => {
  sequelize.close();
});

// describe('authentication /api', function () {
//   beforeEach(async () => {
//     // Clean up the User model before each test
//     await User.destroy({ where: {}, truncate: true });
//   });
// });

describe('GET /api/bid', () => {
  beforeEach(async () => {
    // Clean up the User model before each test
    await Bid.destroy({ where: {}, truncate: true });
  });
  it('Normal get (200)', async () => {
    Bid.findOne.mockResolvedValue(mockBid);
    const response = await api.get('/api/bid/1').expect(200).expect('Content-Type', /application\/json/);
    expect(response.body).toEqual(mockBid);
  });
  it('empty get (404)', async () => {
    Bid.findOne.mockResolvedValue(0);
    const response = await api.get('/api/bid/999').expect(404);
    expect(response.body).toEqual({});
  });

  it('Param is not int (500)', async () => {
    Bid.findOne.mockRejectedValueOnce(mockBid);
    await api.get('/api/bid/dog').expect(500);
  });
});

describe('POST /api', () => {
  beforeEach(async () => {
    // Clean up the User model before each test
    await Bid.destroy({ where: {}, truncate: true });
    jest.clearAllMocks();
  });
  it('amount negative should return status (400)', async () => {
    Bid.create.mockRejectedValueOnce({
      name: 'SequelizeValidationError',
      message: 'Validation min on amount failed',
      errors: [
        {
          message: 'Validation min on amount failed',
          type: 'Validation error',
          path: 'amount',
          value: mockBidInvalid.amount
        }
      ]
    });

    const response = await api
      .post('/api/bid')
      .set('Authorization', 'Bearer fakeToken')
      .send(mockBidInvalid);
    expect(response.status).toBe(400);
  });
  it('Default valid (201)', async () => {
    Bid.create.mockResolvedValueOnce(mockBid);

    const response = await api
      .post('/api/bid')
      .set('Authorization', 'Bearer fakeToken')
      .send(mockBid);
    expect(response.status).toBe(201);
  });
  it('invalid schema (400)', async () => {
    Bid.create.mockRejectedValueOnce(mockBidInvalid1);

    const response = await api
      .post('/api/bid')
      .set('Authorization', 'Bearer fakeToken')
      .send(mockBidInvalid1);
    expect(response.status).toBe(400);
  });
});

describe('DELETE /api', () => {
  it('should delete a bid successfully', async () => {
    Bid.destroy.mockResolvedValueOnce(mockBid); // Simulate successful deletion
    const response = await api
      .delete('/api/bid/1')
      .expect(200);
    expect(response.body.status).toBe('Deleted');
  });

  it('should return 404 when user is not found', async () => {
    const bid_id = 999; // Non-existing user

    Bid.destroy.mockResolvedValueOnce(0);
    const response = await api
      .delete(`/api/bid/${bid_id}`)
      .expect(404);
    expect(response.body.error).toBe('User not found');
  });
  it('Pass param id string (500)', async () => {
    Bid.destroy.mockRejectedValueOnce(0);
    await api
      .delete('/api/bid/cat')
      .expect(500);
  });
});
