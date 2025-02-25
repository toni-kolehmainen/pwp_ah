const { dbSync, User  } = require('../models'); // models
const { sequelize  } = require('../utils/db'); // Import sequelize
const supertest = require('supertest');
const app = require('../app'); // Import Express app
const api = supertest(app);
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {mockUser} = require('./data')

jest.mock('express-rate-limit', () => {
  return jest.fn().mockImplementation(() => (req, res, next) => {
    next(); // Mocking the rate-limiting middleware without enforcing limits
  });
});
// Mock bcrypt and jwt
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));
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

describe('GET /api/login', function () {
  beforeEach(async () => {
    // Clean up the User model before each test
    await User.destroy({ where: {}, truncate: true });
    jest.clearAllMocks();
  });

  it('Normal login', async function () {
    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('mocked-jwt-token');

    await api
      .post('/api/login/1')
      .send({ email: mockUser.email, password: 'password123' })
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .then((response) => {
        expect(response.body.token).toBe('mocked-jwt-token');
      });
    expect(bcrypt.compare).toHaveBeenCalledWith('password123', mockUser.password);
  });
  it('login wrong schema', async function () {
    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('mocked-jwt-token');

    await api
      .post('/api/login/1')
      .send({ name: 'test', password: 'password123' })
      .expect(400).then((response) => {
        expect(response.body.error).toBe('Invalid Request body');
      });
  });
  it('user not found', async function () {
    User.findOne.mockResolvedValue(null);

    await api
      .post('/api/login/1')
      .send({ email: mockUser.email, password: 'password123' })
      .expect(404)
      .expect('Content-Type', /application\/json/)
      .then((response) => {
        expect(response.body.message).toBe("user not found");
      });
  });
  it('login wrong email', async function () {
    User.findOne.mockResolvedValue(mockUser);
    await api
      .post('/api/login/1')
      .send({ email: "john.doe@gmail.com", password: 'password123' })
      .expect(400).then((response) => {
        expect(response.body.error).toBe('Invalid email or password');
      });
  });
  it('login wrong email', async function () {
    User.findOne.mockResolvedValue(mockUser);
    await api
      .post('/api/login/1')
      .send({ email: "john.doe@gmail.com", password: 'password123' })
      .expect(400).then((response) => {
        expect(response.body.error).toBe('Invalid email or password');
      });
  });
  it('call login with string', async function () {
    User.findOne.mockRejectedValueOnce({
      name: 'SequelizeDatabaseError',
      message: 'invalid input syntax for type integer: "authentication"',
      parent: {
        code: '22P02', // PostgreSQL error code for invalid integer syntax
        message: 'invalid input syntax for type integer: "authentication"',
      },
    });
    await api
      .post('/api/login/authentication')
      .send({ email: mockUser.email, password: 'password123' })
      .expect(500).then((response) => {
        expect(response.body.error).toBe('invalid input syntax for type integer: "authentication"');
      });
  });
});
