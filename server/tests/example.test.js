const supertest = require('supertest');
const { dbSync } = require('../models'); // models
const { sequelize } = require('../utils/db'); // Import sequelize
const app = require('../app');
// Import your Express app
const api = supertest(app);
const { mockUser } = require('./data');

jest.mock('../models', () => {
  const { mockUser } = require('./data');
  const mockModel = {
    findAll: jest.fn().mockResolvedValue([mockUser]), // Return the mock user
    findOne: jest.fn().mockResolvedValue(mockUser),
    create: jest.fn().mockResolvedValue(mockUser),
    update: jest.fn().mockResolvedValue([1]), // Assuming one row updated
    destroy: jest.fn().mockResolvedValue(1) // Assuming one row deleted
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

describe('GET /api', () => {
  it('should return status 200 if mock user created', async () => {
    await api.get('/api/users').expect(200).expect('Content-Type', /application\/json/);
  });
  it('should return the mock user', async () => {
    const response = await api.get('/api/users').expect(200);
    expect(response.body).toEqual([mockUser]);
  });
});

beforeAll(async () => {
  await dbSync();
  console.log('Database is synced before running tests');
});

afterAll(async () => {
  sequelize.close();
});
