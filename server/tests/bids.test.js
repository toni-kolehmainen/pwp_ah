const supertest = require('supertest');
const { dbSync, Bid } = require('../models'); // models
const { sequelize } = require('../utils/db'); // Import sequelize
const app = require('../app');
// Import your Express app
const api = supertest(app);
const { mockUser } = require('./data');

const mockBids = [
  {
    id: 1,
    amount: 500,
    user_id: 1,
    category_id: 1
  }
];
const mockBidDelete = {
  id: 1,
  amount: 500,
  user_id: 1,
  auction_id: 1
};
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
// Mock the models with the imported mocks
jest.mock('../models', () => {
  const mockModel = {
    findAll: jest.fn(),
    destroy: jest.fn()
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

describe('GET /api', () => {
  it('should return status 204 and empty', async () => {
    Bid.findAll.mockResolvedValue();
    const response = await api.get('/api/bids').expect(204);
    expect(response.body).toEqual({});
  });

  it('should return the mock user', async () => {
    Bid.findAll.mockResolvedValue(mockBids);

    await api
      .get('/api/bids')
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .then((response) => {
        expect(response.body).toEqual(mockBids);
      });
  });
});

describe('DELETE /api', () => {
  it('delete bid and return the mock user', async () => {
    Bid.destroy.mockResolvedValue(mockBidDelete);

    await api
      .delete('/api/bids')
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .then((response) => {
        expect(response.body).toEqual(mockBidDelete);
      });
  });
  it('delete bids and return the mock user', async () => {
    Bid.destroy.mockResolvedValue(mockBidsDelete);

    await api
      .delete('/api/bids')
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .then((response) => {
        expect(response.body).toEqual(mockBidsDelete);
      });
  });
});
