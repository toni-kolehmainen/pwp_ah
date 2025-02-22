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
    User.findOne.mockResolvedValue(mockUser);
    const response = await api.get('/api/user/1').expect(200).expect('Content-Type', /application\/json/);
    expect(response.body).toEqual(mockUser);
  });
  it('empty get (204)', async function () {
    User.findOne.mockResolvedValue(0);
    const response = await api.get('/api/user/999').expect(204);
    expect(response.body).toEqual({});
  });

  it('Param is not int (500)', async function () {
    User.findOne.mockRejectedValueOnce(mockUser);
    await api.get('/api/user/kissa').expect(500);
  });
});

describe('POST /api', function () {
  beforeEach(async () => {
    // Clean up the User model before each test
    await User.destroy({ where: {}, truncate: true });
  });
 it('no name should return status (400)', async function () {
    User.create.mockResolvedValueOnce(mockUserWrong);
    // Make the POST request
    const response = await api
      .post('/api/user')
      .send(mockUserWrong);
    expect(response.status).toBe(400);
  });
  it('Default valid (201)', async function () {
    User.create.mockResolvedValueOnce(mockUser);
    // Make the POST request
    const response = await api
      .post('/api/user')
      .send(mockUser);
    expect(response.status).toBe(201);
  });
  it('Email unique constraint (409)', async function () {

    await api.post('/api/user')
      .send(mockUser)
      .expect('Content-Type', /application\/json/)
      .expect(201);

    User.create.mockRejectedValueOnce({
      name: 'SequelizeUniqueConstraintError', // Ensure the mock includes the correct error type
      code: '23505',                          // PostgreSQL error code for unique constraint violation
      message: 'duplicate key value violates unique constraint "users_email_key"',  // Error message from PostgreSQL
      parent: {
        code: '23505',                         // The PostgreSQL error code in the parent object
        message: 'duplicate key value violates unique constraint "users_email_key"',  // Message from the parent object
      },
      errors: [
        {
          message: 'Email must be unique',
          type: 'unique violation',
          path: 'email',  // Path to the field in error
          value: mockUser.email  // The conflicting value
        }
      ]
    });

    const response = await api
      .post('/api/user')
      .send(mockUser)
      .expect('Content-Type', /application\/json/);
    expect(response.status).toBe(409)
  });
});

describe('PUT /api', function () {
  beforeEach(async () => {
    // Clean up the User model before each test
    await User.destroy({ where: {}, truncate: true });
  });
  it('Normal valid with password (200)', async function () {
    User.update.mockResolvedValueOnce(mockUser)
    const response = await api.put('/api/user/1').send(mockUpdateUser).expect('Content-Type', /application\/json/)
    expect(response.status).toBe(200)
  });
  it('Normal valid with username (200)', async function () {
    User.update.mockResolvedValueOnce(mockUser)
    const response = await api.put('/api/user/1').send(mockUpdateUser1).expect('Content-Type', /application\/json/)
    expect(response.status).toBe(200)
  });
  it('try to update two lines same time (400)', async function () {
    User.update.mockRejectedValueOnce(mockUser)
    const response = await api.put('/api/user/1').send(mockUpdateUserInvalid).expect('Content-Type', /application\/json/)
    expect(response.status).toBe(400)
  });
  it('Invalid id (500)', async function () {
    User.update.mockRejectedValueOnce({
      name: 'SequelizeDatabaseError',
      message: 'invalid input syntax for type integer: "kissa"',
      parent: {
        code: '22P02', // PostgreSQL error code for invalid input syntax
        message: 'invalid input syntax for type integer: "kissa"',
      }
    });
    await api.put('/api/user/kissa').send(mockUpdateUser).expect(500)
  });
});

describe('DELETE /api', function () {
  it('should delete a user successfully', async () => {
    User.destroy.mockResolvedValueOnce(mockUser); // Simulate successful deletion
    const response = await api
      .delete(`/api/user/1`)
      .expect(200);
    expect(response.body.status).toBe('Deleted');
  });

  it('should return 404 when user is not found', async () => {
    const userId = 999; // Non-existing user
  
    User.destroy.mockResolvedValueOnce(0); 
    const response = await api
      .delete(`/api/user/${userId}`)
      .expect(404);
    expect(response.body.error).toBe('User not found');
  });
  it('Pass param id string (500)', async () => {
    User.destroy.mockRejectedValueOnce(0);
    await api
      .delete(`/api/user/kissa`)
      .expect(500);
  });
});