const supertest = require('supertest');
const { dbSync, Bid } = require('../models'); // models
const { sequelize } = require('../utils/db'); // Import sequelize
const app = require('../app');

// Import your Express app
const api = supertest(app);

const mockBids = [
  {
    id: 1,
    amount: 500,
    buyer_id: 1,
    auction_id: 1
  },
  {
    id: 2,
    amount: 500,
    buyer_id: 1,
    auction_id: 2
  },
  {
    id: 3,
    amount: 500,
    buyer_id: 2,
    auction_id: 3
  }
];

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

describe('GET /api bidsauctions', () => {
  it('should return status 204 and empty', async () => {
    Bid.findAll.mockResolvedValue([]);
    const response = await api.get('/api/auctions/1/bids').expect(204);
    expect(response.body).toEqual({});
  });

  it('should return the mock bid', async () => {
    Bid.findAll.mockResolvedValue(mockBids);

    const response = await api.get('/api/auctions/1/bids').expect(200);
    const body = response.body;

    // Check for _links
    expect(body).toHaveProperty('_links');
    expect(body._links).toHaveProperty('self');
    expect(body._links).toHaveProperty('create');
    expect(body._links.create).toHaveProperty('href', '/api/bids');
    expect(body._links.profile).toHaveProperty('href', '/profile/bids/');

    // Check for _embedded and embedded bids array
    expect(body).toHaveProperty('_embedded');
    expect(body._embedded).toHaveProperty('bids');
    expect(Array.isArray(body._embedded.bids)).toBe(true);

    // Check for the properties of the first user in the embedded array
    const bid = body._embedded.bids[0];
    expect(bid).toHaveProperty('_links');
    expect(bid._links).toHaveProperty('self');
    expect(bid._links.self).toHaveProperty('href', `/api/bids/${mockBids[0].id}`);
    
    // Verify that user has 'amount', 'buyer_id', and 'auction_id'
    expect(bid).toHaveProperty('amount');
    expect(bid).toHaveProperty('buyer_id');
    expect(bid).toHaveProperty('auction_id');
    expect(bid).toHaveProperty('auction_id', mockBids[0].auction_id);
    // Ensure 'href' for delete are present
    expect(bid._links).toHaveProperty('delete');
    expect(bid._links.delete).toHaveProperty('href', `/api/bids/${mockBids[0].id}`);
  });
  it('Pass param id string (500)', async () => {
      Bid.findAll.mockRejectedValueOnce(0);
      await api
        .get('/api/auctions/cat/bids')
        .expect(500);
    });
});
