const supertest = require('supertest');
const { dbSync, Auction } = require('../models'); // models
const { sequelize } = require('../utils/db'); // Import sequelize
const app = require('../app');
const { current_price } = require('../static/profiles/auction');

// Import your Express app
const api = supertest(app);

const mockAuctions = [
  { 
    id: 1, 
    description: 'Laptop Auction', 
    starting_price: 500.00,
    current_price: 550.00,
    seller_id: 1,
    end_time: "2025-04-25T15:39:21.468Z",
  },
  { 
    id: 2, 
    description: 'Phone Auction', 
    starting_price: 300.00,
    current_price: 550.00,
    seller_id: 2,
    end_time: "2025-03-25T15:39:21.468Z",
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
  await Auction.destroy({ where: {} });
});

afterAll(async () => {
  sequelize.close();
});

describe('GET /api ', () => {
  it('should return status 204 and empty', async () => {
    Auction.findAll.mockResolvedValue([]);
    const response = await api.get('/api/users/1/auctions').expect(204);
    expect(response.body).toEqual({});
  });

  it('should return the mock auction', async () => {
    Auction.findAll.mockResolvedValue(mockAuctions);

    const response = await api.get('/api/users/1/auctions').expect(200);
    const body = response.body;

    // Check for _links
    expect(body).toHaveProperty('_links');
    expect(body._links).toHaveProperty('self');
    expect(body._links).toHaveProperty('create');
    expect(body._links.create).toHaveProperty('href', '/api/auctions');
    expect(body._links.profile).toHaveProperty('href', '/profile/auctions/');

    // Check for _embedded and embedded bids array
    expect(body).toHaveProperty('_embedded');
    expect(body._embedded).toHaveProperty('auctions');
    expect(Array.isArray(body._embedded.auctions)).toBe(true);

    // Check for the properties of the first user in the embedded array
    const auction = body._embedded.auctions[0];
    expect(auction).toHaveProperty('_links');
    expect(auction._links).toHaveProperty('self');
    expect(auction._links.self).toHaveProperty('href', `/api/auctions/${mockAuctions[0].id}`);
    
    // Verify that user has 'starting_price', 'end_time', and 'seller_id'
    expect(auction).toHaveProperty('starting_price');
    expect(auction).toHaveProperty('end_time');
    expect(auction).toHaveProperty('seller_id');
    expect(auction).toHaveProperty('seller_id', mockAuctions[0].seller_id);
    // Ensure 'href' for delete are present
    expect(auction._links).toHaveProperty('delete');
    expect(auction._links.delete).toHaveProperty('href', `/api/auctions/${mockAuctions[0].seller_id}`);
  });
  it('Pass param id string (500)', async () => {
    Auction.findAll.mockRejectedValueOnce(0);
      await api
        .get('/api/users/dog/auctions')
        .expect(500);
    });
});
