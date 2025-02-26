// test items
// mock when empty
// when content
// not found
// range

const supertest = require('supertest');
const { dbSync, Item } = require('../models'); // models
const { sequelize } = require('../utils/db'); // Import sequelize
const app = require('../app');
// Import your Express app
const api = supertest(app);
const { mockItems } = require('./data');

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
  await Item.destroy({ where: {} });
  console.log('Database is synced before running tests');
});

afterAll(async () => {
  sequelize.close();
});

describe('GET /api/items', () => {
  it('should return status 204 and empty object when no items exist', async () => {
    Item.findAll.mockResolvedValue([]);
    const response = await api.get('/api/items').expect(204);
    expect(response.body).toEqual({});
  });

  it('should return status 200 and the mock items', async () => {
    Item.findAll.mockResolvedValue(mockItems);
    const response = await api.get('/api/items').expect(200);
    expect(response.body).toEqual(mockItems);
  });

  it('should return status 500 if database throws an error', async () => {
    Item.findAll.mockRejectedValue(new Error('Database error'));
    const response = await api.get('/api/items').expect(500);
    expect(response.body.error).toBe('Database error');
  });

  // it('should handle large dataset responses correctly', async function () {
  // const largeMockItems = Array(100).fill(mockItems[0]); // Simulate many items
  // Item.findAll.mockResolvedValue(largeMockItems);
  // const response = await api.get('/api/items').expect(200);
  // expect(response.body.length).toBe(100);
  // });
});
