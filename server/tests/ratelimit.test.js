const supertest = require('supertest');
const { dbSync, User } = require('../models'); // models
const { sequelize } = require('../utils/db'); // Import sequelize
const app = require('../app');
// Import Express app
const api = supertest(app);
const { mockUser, mockUserWrong } = require('./data');

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

describe('GET /api/user', () => {
  beforeEach(() => {
    // Clean up the User model before each test
    jest.clearAllMocks();
  });

  it('First five should be 200 and final 429', async () => {
    User.findOne.mockResolvedValue(mockUser);
    for (let index = 0; index < 5; index++) {
      await api.get('/api/user/1').expect(200).expect('Content-Type', /application\/json/);
    }
    await api.get('/api/user/1').expect(429);
  });
});

// You need to wait for the database models to create.
beforeAll(async () => {
  await dbSync();
  console.log('Database is synced before running tests');
});

afterAll(async () => {
  sequelize.close();
});
