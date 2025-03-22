const supertest = require('supertest');
const { dbSync, Bid } = require('../models'); // models
const { sequelize } = require('../utils/db'); // Import sequelize
const app = require('../app');
// Import Express app
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
jest.mock('express-rate-limit', () => jest.fn().mockImplementation(() => (req, res, next) => {
  next(); // Mocking the rate-limiting middleware without enforcing limits
}));

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

describe('GET /api/bids bid', () => {
  beforeEach(async () => {
    // Clean up the User model before each test
    await Bid.destroy({ where: {}, truncate: true });
  });
  it('Normal get (200)', async () => {
    Bid.findOne.mockResolvedValue(mockBid);
    const response = await api.get('/api/bids/1').expect(200).expect('Content-Type', /application\/json/);

    const body = response.body;
    // Check for _links
    expect(body).toHaveProperty('_links');
    expect(body._links).toHaveProperty('self');
    expect(body._links.self).toHaveProperty('href', `/api/bids/${mockBid.id}`);
    expect(body._links).toHaveProperty('delete');
    expect(body._links.delete).toHaveProperty('href', `/api/bids/${mockBid.id}`, "method", "DELETE");
    expect(body._links).toHaveProperty('edit');
    expect(body._links.edit).toHaveProperty('href', `/api/bids/${mockBid.id}`, "method", "PUT");
    expect(body._links).toHaveProperty('profile');
    expect(body._links.profile).toHaveProperty('href', '/profiles/bids');
    expect(body._links).toHaveProperty('all');
    expect(body._links.all).toHaveProperty('href', '/api/bids');
    
    // check for data values mathcing the mockUser
    expect(body).toHaveProperty('amount', mockBid.amount);
    expect(body).toHaveProperty('buyer_id', mockBid.buyer_id);
    expect(body).toHaveProperty('auction_id', mockBid.auction_id);
  });
  it('empty get (404)', async () => {
    Bid.findOne.mockResolvedValue(0);
    const response = await api.get('/api/bids/999').expect(404);
    expect(response.body).toEqual({});
  });

  it('Param is not int (500)', async () => {
    Bid.findOne.mockRejectedValueOnce(mockBid);
    await api.get('/api/bids/dog').expect(500);
  });
});



describe('DELETE /api', () => {
  it('should delete a bid successfully', async () => {
    Bid.destroy.mockResolvedValueOnce(mockBid); // Simulate successful deletion
    const response = await api
      .delete('/api/bids/1')
      .expect(200);
    expect(response.body.status).toBe('Deleted');
  });

  it('should return 404 when user is not found', async () => {
    const bid_id = 999; // Non-existing user

    Bid.destroy.mockResolvedValueOnce(0);
    const response = await api
      .delete(`/api/bids/${bid_id}`)
      .expect(404);
    expect(response.body.error).toBe('User not found');
  });
  it('Pass param id string (500)', async () => {
    Bid.destroy.mockRejectedValueOnce(0);
    await api
      .delete('/api/bids/cat')
      .expect(500);
  });
});
