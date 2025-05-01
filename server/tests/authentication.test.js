const supertest = require('supertest');
const { dbSync, User } = require('../models');
const { sequelize } = require('../utils/db');
const app = require('../app');
const api = supertest(app);
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { mockUser } = require('./data');

jest.mock('express-rate-limit', () => jest.fn().mockImplementation(() => (req, res, next) => {
  next();
}));
jest.mock('bcrypt', () => ({
  compare: jest.fn()
}));
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn()
}));
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

beforeAll(async () => {
  await dbSync();
  console.log('Database is synced before running tests');
});

afterAll(async () => {
  sequelize.close();
});

describe('POST /api/login', () => {
  beforeEach(async () => {
    await User.destroy({ where: {}, truncate: true });
    jest.clearAllMocks();
  });

  it('Normal login', async () => {
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

  it('login wrong schema', async () => {
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

  it('user not found', async () => {
    User.findOne.mockResolvedValue(null);

    await api
      .post('/api/login/1')
      .send({ email: mockUser.email, password: 'password123' })
      .expect(404)
      .expect('Content-Type', /application\/json/)
      .then((response) => {
        expect(response.body.error).toBe('user not found');
      });
  });

  it('login wrong email', async () => {
    User.findOne.mockResolvedValue(mockUser);
    await api
      .post('/api/login/1')
      .send({ email: 'john.doe@gmail.com', password: 'password123' })
      .expect(401).then((response) => {
        expect(response.body.error).toBe('Invalid email or password');
      });
  });

  it('login wrong password', async () => {
    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(false);
    await api
      .post('/api/login/1')
      .send({ email: mockUser.email, password: 'wrongpassword' })
      .expect(401).then((response) => {
        expect(response.body.error).toBe('Invalid email or password');
      });
  });

  it('call login with string', async () => {
    await api
      .post('/api/login/authentication')
      .send({ email: mockUser.email, password: 'password123' })
      .expect(500).then((response) => {
        expect(response.body.error).toBe('invalid input syntax for type integer: "authentication"');
      });
  });

  it('handles database error', async () => {
    User.findOne.mockRejectedValue(new Error('Database connection failed'));
    await api
      .post('/api/login/1')
      .send({ email: mockUser.email, password: 'password123' })
      .expect(500)
      .then((response) => {
        console.log('Response body:', response.body); // Debug log
        expect(response.body.error).toBe('Database connection failed');
      });
  });
});