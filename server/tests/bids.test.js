const supertest = require('supertest');
const { dbSync, Bid } = require('../models'); // models
const { sequelize } = require('../utils/db'); // Import sequelize
const app = require('../app');
const { authenticateJWT } = require('../utils/middleware');
// Import your Express app
const api = supertest(app);

const mockBid = {
  amount: 500,
  buyer_id: 1,
  auction_id: 1,
  toJSON: jest.fn().mockReturnValue({
    amount: 500,
    buyer_id: 1,
    auction_id: 1
  }),
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

const mockBids = 
  {
    id: 1,
    amount: 500,
    user_id: 1,
    category_id: 1,
    toJSON: jest.fn().mockReturnValue({
      id: 1,
      amount: 500,
      user_id: 1,
      category_id: 1,
    }),
  }


mockBidsDelete = [
  {
    id: 1,
    amount: 500,
    user_id: 1,
    auction_id: 1
  },
  {
    id: 2,
    amount: 500,
    user_id: 1,
    auction_id: 2
  },
  {
    id: 3,
    amount: 500,
    user_id: 2,
    auction_id: 3
  }
];

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
// Mock the models with the imported mocks
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

beforeAll(async () => {
  await dbSync(); // Sync the database
  await Bid.destroy({ where: {} });
});

afterAll(async () => {
  sequelize.close();
});

describe('GET /api bids', () => {
  it('should return status 204 and empty', async () => {
    Bid.findAll.mockResolvedValue([]);
    const response = await api.get('/api/bids').expect(204);
    expect(response.body).toEqual({});
  });

  it('should return the mock bid', async () => {
    Bid.findAll.mockResolvedValue([mockBids]);

    const response = await api.get('/api/bids').expect(200);
    const body = response.body;

    // Check for _links
    expect(body).toHaveProperty('_links');
    expect(body._links).toHaveProperty('self');
    expect(body._links).toHaveProperty('create');
    expect(body._links.create).toHaveProperty('href', '/api/bids');
    expect(body._links.profile).toHaveProperty('href', '/profiles/bids/');

    // Check for _embedded and embedded bids array
    expect(body).toHaveProperty('_embedded');
    expect(body._embedded).toHaveProperty('bids');
    expect(Array.isArray(body._embedded.bids)).toBe(true);

    // Check for the properties of the first user in the embedded array
    const bid = body._embedded.bids[0];
    expect(bid).toHaveProperty('_links');
    expect(bid._links).toHaveProperty('self');
    expect(bid._links.self).toHaveProperty('href', `/api/bids/${mockBids.id}`);
    
    // Verify that user has 'amount', 'user_id', and 'category_id'
    expect(bid).toHaveProperty('amount');
    expect(bid).toHaveProperty('user_id');
    expect(bid).toHaveProperty('category_id');
    
    // Ensure 'href' for delete and edit are present
    expect(bid._links).toHaveProperty('delete');
    expect(bid._links.delete).toHaveProperty('href', `/api/bids/${mockBids.id}`);
    expect(bid._links).toHaveProperty('edit');
    expect(bid._links.edit).toHaveProperty('href', `/api/bids/${mockBids.id}`);
  });
});

describe('POST /api bids', () => {
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
      .post('/api/bids')
      .set('Authorization', 'Bearer fakeToken')
      .send(mockBidInvalid);
    expect(response.status).toBe(400);
  });
  it('Default valid (201)', async () => {
    Bid.create.mockResolvedValueOnce(mockBid);

    const response = await api
      .post('/api/bids')
      .set('Authorization', 'Bearer fakeToken')
      .send(mockBid);
    expect(response.status).toBe(201);
  });
  it('invalid schema (400)', async () => {
    Bid.create.mockRejectedValueOnce(mockBidInvalid1);

    const response = await api
      .post('/api/bids')
      .set('Authorization', 'Bearer fakeToken')
      .send(mockBidInvalid1);
    expect(response.status).toBe(400);
  });
});