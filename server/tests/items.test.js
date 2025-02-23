// test items
// mock when empty
// when content
// not found
// range

const { dbSync, Item } = require('../models'); // models
const { sequelize } = require('../utils/db'); // Import sequelize
const supertest = require('supertest');
const app = require('../app'); // Import your Express app
const api = supertest(app);
const { mockItems } = require('./data');

// Mock the models with the imported mocks
jest.mock('../models', () => {
  const mockModel = {
    findAll: jest.fn(),
    destroy: jest.fn(),
  };

  return {
    User: mockModel,
    Item: mockModel,
    Category: mockModel,
    Auction: mockModel,
    Bid: mockModel,
    dbSync: jest.fn(),
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

describe('GET /api/items', function () {
  it('should return status 204 and empty', async function () {
    Item.findAll.mockResolvedValue([]);
    const response = await api.get('/api/items').expect(204);
    expect(response.body).toEqual({});
  });

  it('should return status 200 if mock items exist', async function () {
    Item.findAll.mockResolvedValue(mockItems);

    await api.get('/api/items').expect(200).expect('Content-Type', /application\/json/);
  });

  it('should return the mock items', async function () {
    Item.findAll.mockResolvedValue(mockItems);
    const response = await api.get('/api/items').expect(200);
    expect(response.body).toEqual(mockItems);
  });
});