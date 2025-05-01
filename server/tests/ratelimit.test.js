const supertest = require('supertest');
const { dbSync, User } = require('../models');
const { sequelize } = require('../utils/db');
const app = require('../app');
const api = supertest(app);
const { mockUser } = require('./data');

// Unmock express-rate-limit to avoid global mock interference
jest.unmock('express-rate-limit');
// Mock express-rate-limit specifically for this test suite
jest.mock('express-rate-limit', () => {
  let requestCount = 0;
  const middleware = jest.fn((req, res, next) => {
    requestCount++;
    console.log(`Request #${requestCount} to ${req.path}`); // Debug log
    if (requestCount > 5) {
      return res.status(429).json({ message: 'Too many requests, please try again later.' });
    }
    next();
  });
  return jest.fn(() => middleware);
});

jest.mock('../models', () => {
  const mockModel = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
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

describe('GET /api/users ratelimit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset requestCount for each test
    const rateLimit = require('express-rate-limit');
    rateLimit.mockImplementation(() => {
      let requestCount = 0;
      return (req, res, next) => {
        requestCount++;
        console.log(`Request #${requestCount} to ${req.path}`); // Debug log
        if (requestCount > 5) {
          return res.status(429).json({ message: 'Too many requests, please try again later.' });
        }
        next();
      };
    });
  });

  it('First five should be 200 and final 429', async () => {
    User.findOne.mockResolvedValue(mockUser);
    // Send 5 requests expecting 200
    for (let index = 0; index < 5; index++) {
      await api
        .get('/api/users/1')
        .expect(200)
        .expect('Content-Type', /application\/json/);
    }
    // Send 6th request expecting 429
    await api
      .get('/api/users/1')
      .expect(429)
      .expect('Content-Type', /application\/json/)
      .expect({ message: 'Too many requests, please try again later.' });
  });
});

beforeAll(async () => {
  await dbSync();
  console.log('Database is synced before running tests');
});

afterAll(async () => {
  sequelize.close();
});