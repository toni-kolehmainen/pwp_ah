const { dbSync, Category  } = require('../models'); // models
const { sequelize  } = require('../utils/db'); // Import sequelize
const supertest = require('supertest');
const app = require('../app'); // Import your Express app
const api = supertest(app);
const {mockCategory, mockCategories, mockCategoryWrong} = require('./data');
const test = { name: 'Unique Category' };

jest.mock('express-rate-limit', () => {
  return jest.fn().mockImplementation(() => (req, res, next) => {
    next(); // Mocking the rate-limiting middleware without enforcing limits
  });
});

jest.mock('../models', () => {
  const mockModel = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    truncate: jest.fn(),
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
  await dbSync();
  console.log('Database is synced before running tests');
});

afterAll(async () => {
  sequelize.close()
});

describe('GET /api', function () {
  it('should return status 200', async function () {
    Category.findAll.mockResolvedValue(mockCategories);
    await api.get('/api/categories').expect(200).expect('Content-Type', /application\/json/);
  });
  it('should return the mock user', async function () {
    Category.findAll.mockResolvedValue(mockCategories);
    const response = await api.get('/api/categories').expect(200);
    expect(response.body).toEqual(mockCategories);
  });
  it('should return status 404', async function () {
    await api.get('/api/category').expect(404).expect('Content-Type', /application\/json/);
  });
});
// test unique for line 33
describe('POST /api', function () {
  it('Normal post request (201)', async function () {

    // Make the POST request
    const response = await api
      .post('/api/categories')
      .send(test).expect('Content-Type', /application\/json/);
      expect(response.status).toBe(201);
  });
  it('Name unique post request (409)', async function () {
    
    await api.post('/api/categories')
      .send(test)
      .expect('Content-Type', /application\/json/)
      .expect(201);

    Category.create.mockRejectedValueOnce({
      code: '23505',
      message: 'duplicate key value violates unique constraint "categories_name_key"',
    });

    const response = await api
      .post('/api/categories')
      .send(test)
      .expect('Content-Type', /application\/json/);
    expect(response.status).toBe(409); // Expect conflict due to duplicate category name
  });

  it('Invalid category post (400)', async function () {
    Category.create.mockResolvedValueOnce(mockCategoryWrong);
    // Make the POST request
    const response = await api
      .post('/api/categories')
      .send(mockCategoryWrong).expect('Content-Type', /application\/json/);
    expect(response.status).toBe(400);
  });
});

describe('DELETE /api', function () {
  it('should delete a category successfully', async () => {
    Category.destroy.mockResolvedValueOnce(mockCategory); // Simulate successful deletion
    const response = await api
      .delete(`/api/categories/1`)
      .expect(200);
    expect(response.body.status).toBe('Deleted');
  });

  it('should return 404 when category is not found', async () => {
    const categoryId = 999; // Non-existing category
  
    Category.destroy.mockResolvedValueOnce(0); 
    const response = await api
      .delete(`/api/categories/${categoryId}`)
      .expect(404);
    expect(response.body.error).toBe('Category not found');
  });
  it('Pass param id string (500)', async () => {
    Category.destroy.mockRejectedValueOnce(0);
    const response = await api
      .delete(`/api/categories/kissa`)
      .expect(500);
  });
});