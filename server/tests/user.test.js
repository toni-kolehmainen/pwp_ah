const { dbSync, User  } = require('../models'); // models
const { sequelize  } = require('../utils/db'); // Import sequelize
const supertest = require('supertest');
const app = require('../app'); // Import Express app
const api = supertest(app);
const {mockUser, mockUserWrong} = require('./data')

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

  it('Param is not int (400)', async function () {
    await api.get('/api/user/kissa').expect(400);
  });
});

describe('POST /api', function () {
 it('no name should return status (400)', async function () {
    User.create.mockResolvedValueOnce(mockUserWrong);
    // Make the POST request
    const response = await api
      .post('/api/user/1')
      .send(mockUserWrong);
    expect(response.status).toBe(400);
  });


});

// describe('PUT /api', function () {
 
// });

describe('DELETE /api', function () {
  it('should delete a category successfully', async () => {
    User.destroy.mockResolvedValueOnce(mockCategory); // Simulate successful deletion
    const response = await api
      .delete(`/api/user/1`)
      .expect(200);
    expect(response.body.status).toBe('Deleted');
  });

  it('should return 404 when category is not found', async () => {
    const categoryId = 999; // Non-existing category
  
    User.destroy.mockResolvedValueOnce(0); 
    const response = await api
      .delete(`/api/user/${categoryId}`)
      .expect(404);
    expect(response.body.error).toBe('Category not found');
  });
  it('Pass param id string (500)', async () => {
    User.destroy.mockRejectedValueOnce(0);
    const response = await api
      .delete(`/api/user/kissa`)
      .expect(500);
  });
});