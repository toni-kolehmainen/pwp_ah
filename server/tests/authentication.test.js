const { dbSync, User  } = require('../models'); // models
const { sequelize  } = require('../utils/db'); // Import sequelize
const supertest = require('supertest');
const app = require('../app'); // Import Express app
const api = supertest(app);
const {mockUser, mockUserWrong, mockUpdateUser, 
  mockUpdateUserInvalid, mockUpdateUser1} = require('./data')

jest.mock('express-rate-limit', () => {
  return jest.fn().mockImplementation(() => (req, res, next) => {
    next(); // Mocking the rate-limiting middleware without enforcing limits
  });
});

jest.mock('../models', () => {
  const mockModel = {
    findAll: jest.fn(), // Return the mock user
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(), // Assuming one row updated
    destroy: jest.fn(), // Assuming one row deleted
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

// You need to wait for the database models to create.
beforeAll(async () => {
  await dbSync();
  console.log('Database is synced before running tests');
});

afterAll(async () => {
  sequelize.close()
});

describe('GET /api/user', function () {
  beforeEach(async () => {
    // Clean up the User model before each test
    await User.destroy({ where: {}, truncate: true });
  });

  it('Normal get (200)', async function () {
    
  });
});
