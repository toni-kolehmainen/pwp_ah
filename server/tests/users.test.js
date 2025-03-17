// test users
// mock when empty
// when content
// not found
// range

const supertest = require('supertest');
const { dbSync, User } = require('../models'); // models
const { sequelize } = require('../utils/db'); // Import sequelize
const app = require('../app');
// Import your Express app
const api = supertest(app);
const { mockUser } = require('./data');

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
  await User.destroy({ where: {} });
  console.log('Database is synced before running tests');
});

afterAll(async () => {
  sequelize.close();
});

describe('GET /api', () => {
  it('should return status 204 and empty', async () => {
    User.findAll.mockResolvedValue([]);
    const response = await api.get('/api/users').expect(204);
    expect(response.body).toEqual({});
  });

  it('should return status 200 if mock user created', async () => {
    User.findAll.mockResolvedValue(mockUser);

    await api.get('/api/users').expect(200).expect('Content-Type', /application\/json/);
  });

  it('should return the mock user', async () => {
    User.findAll.mockResolvedValue([mockUser]);
    const response = await api.get('/api/users').expect(200);
    expect(response.body).toEqual(mockUser);
  });
});
