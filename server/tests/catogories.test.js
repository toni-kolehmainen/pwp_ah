const supertest = require('supertest');
const { dbSync, Category } = require('../models'); // models
const { sequelize } = require('../utils/db'); // Import sequelize
const app = require('../app');
// Import your Express app
const api = supertest(app);
const { mockCategory, mockCategories, mockCategoryWrong } = require('./data');

const test = { 
  name: 'Unique Category',
  toJSON: jest.fn().mockReturnValue({
    name: 'Unique Category'
  }), };

jest.mock('express-rate-limit', () => jest.fn().mockImplementation(() => (req, res, next) => {
  next(); // Mocking the rate-limiting middleware without enforcing limits
}));

jest.mock('../models', () => {
  const mockModel = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    truncate: jest.fn()
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
  await Category.destroy({ where: {} });
});

afterAll(async () => {
  sequelize.close();
});

describe('GET /api categories', () => {
  it('should return status 200', async () => {
    Category.findAll.mockResolvedValue(mockCategories);
    await api.get('/api/categories').expect(200).expect('Content-Type', /application\/json/);
  });
  it('should return the mock user', async () => {
    Category.findAll.mockResolvedValue(mockCategories);
    const response = await api.get('/api/categories').expect(200);

    const body = response.body;

    // Check for _links
    expect(body).toHaveProperty('_links');
    expect(body._links).toHaveProperty('self');
    expect(body._links).toHaveProperty('create');
    expect(body._links.create).toHaveProperty('href', '/api/categories');
    expect(body._links.profile).toHaveProperty('href', '/profiles/categories/');

    // Check for _embedded and embedded bids array
    expect(body).toHaveProperty('_embedded');
    expect(body._embedded).toHaveProperty('categories');
    expect(Array.isArray(body._embedded.categories)).toBe(true);

    // Check for the properties of the first user in the embedded array
    const categories = body._embedded.categories[0];
    expect(categories).toHaveProperty('_links');
    expect(categories._links).toHaveProperty('self');
    expect(categories._links.self).toHaveProperty('href', `/api/categories/${mockCategories[0].id}`);
    
    // Verify that user has 'amount', 'user_id', and 'category_id'
    expect(categories).toHaveProperty('name');
    expect(categories).toHaveProperty('description');
    
    // Ensure 'href' for delete and edit are present
    expect(categories._links).toHaveProperty('delete');
    expect(categories._links.delete).toHaveProperty('href', `/api/categories/${mockCategories[0].id}`);
  });
  it('should return status 404', async () => {
    await api.get('/api/category').expect(404).expect('Content-Type', /application\/json/);
  });
});
// test unique for line 33
describe('POST /api categories', () => {

  beforeEach(async () => {
    // Clean up the User model before each test
    await Category.destroy({ where: {}, truncate: true });
    jest.clearAllMocks();
  });
  it('Normal post request (201)', async () => {
    Category.create.mockResolvedValueOnce(test);
    // Make the POST request
    const response = await api
      .post('/api/categories')
      .send(test).expect('Content-Type', /application\/json/);
    expect(response.status).toBe(201);
  });
  it('Name unique post request (409)', async () => {
    Category.create.mockResolvedValueOnce(test);
    await api.post('/api/categories')
      .send(test)
      .expect('Content-Type', /application\/json/)
      .expect(201);

    Category.create.mockRejectedValueOnce({
      code: '23505',
      message: 'duplicate key value violates unique constraint "categories_name_key"'
    });

    const response = await api
      .post('/api/categories')
      .send(test)
      .expect('Content-Type', /application\/json/);
    expect(response.status).toBe(409); // Expect conflict due to duplicate category name
  });

  it('Invalid category post (400)', async () => {
    Category.create.mockResolvedValueOnce(mockCategoryWrong);
    // Make the POST request
    const response = await api
      .post('/api/categories')
      .send(mockCategoryWrong).expect('Content-Type', /application\/json/);
    expect(response.status).toBe(400);
  });
});

describe('DELETE /api categories', () => {
  it('should delete a category successfully', async () => {
    Category.destroy.mockResolvedValueOnce(mockCategory); // Simulate successful deletion
    const response = await api
      .delete('/api/categories/1')
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
      .delete('/api/categories/kissa')
      .expect(500);
  });
});
