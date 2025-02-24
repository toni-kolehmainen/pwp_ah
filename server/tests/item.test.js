const { dbSync, Item } = require('../models'); // models
const { sequelize } = require('../utils/db'); // Import sequelize
const supertest = require('supertest');
const app = require('../app'); // Import Express app
const api = supertest(app);
const { mockItem, mockItemWrong, mockUpdateItem, mockUpdateItemInvalid, mockUpdateItem1 } = require('./data');

jest.mock('express-rate-limit', () => {
  return jest.fn().mockImplementation(() => (req, res, next) => {
    next(); // Mocking the rate-limiting middleware without enforcing limits
  });
});

jest.mock('../models', () => {
  const mockModel = {
    findAll: jest.fn(), // Return the mock item
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(), // Assuming one row updated
    destroy: jest.fn(), // Assuming one row deleted
  };

  return {
    Item: mockModel,
    User: mockModel,
    Category: mockModel,
    Auction: mockModel,
    Bid: mockModel,
    dbSync: jest.fn(),
  };
});

// You need to wait for the database models to create.
beforeAll(async () => {
  await dbSync();
  await Item.destroy({ where: {} });
  console.log('Database is synced before running tests');
});

afterAll(async () => {
  await sequelize.close();
});

describe('GET /api/item', function () {
  beforeEach(async () => {
    // Clean up the Item model before each test
    await Item.destroy({ where: {}, truncate: true });
  });

  it('Normal get (200)', async function () {
    Item.findOne.mockResolvedValue(mockItem);
    const response = await api.get('/api/item/1').expect(200).expect('Content-Type', /application\/json/);
    expect(response.body).toEqual(mockItem);
  });

  it('empty get (204)', async function () {
    Item.findOne.mockResolvedValue(null); // Return null to simulate no content
    const response = await api.get('/api/item/999').expect(204);
    expect(response.body).toEqual({});
  });

  it('Param is not int (500)', async function () {
    Item.findOne.mockRejectedValueOnce(new Error('Invalid input syntax for type integer'));
    await api.get('/api/item/kissa').expect(500);
  });
  
  
});

describe('POST /api/item', function () {
  beforeEach(async () => {
    // Clean up the Item model before each test
    await Item.destroy({ where: {}, truncate: true });
  });

  it('no name should return status (400)', async function () {
    Item.create.mockResolvedValueOnce(mockItemWrong);
    // Make the POST request
    const response = await api.post('/api/item').send(mockItemWrong);
    expect(response.status).toBe(400);
  });

  it('Default valid (201)', async function () {
    Item.create.mockResolvedValueOnce(mockItem);
    // Make the POST request
    const response = await api.post('/api/item').send(mockItem);
    expect(response.status).toBe(201);
  });

  it('Name unique constraint (409)', async function () {
    await api.post('/api/item').send(mockItem).expect('Content-Type', /application\/json/).expect(201);

    Item.create.mockRejectedValueOnce({
      name: 'SequelizeUniqueConstraintError', // Ensure the mock includes the correct error type
      code: '23505', // PostgreSQL error code for unique constraint violation
      message: 'duplicate key value violates unique constraint "items_name_key"', // Error message from PostgreSQL
      parent: {
        code: '23505', // The PostgreSQL error code in the parent object
        message: 'duplicate key value violates unique constraint "items_name_key"', // Message from the parent object
      },
      errors: [
        {
          message: 'Name must be unique',
          type: 'unique violation',
          path: 'name', // Path to the field in error
          value: mockItem.name, // The conflicting value
        },
      ],
    });

    const response = await api.post('/api/item').send(mockItem).expect('Content-Type', /application\/json/);
    expect(response.status).toBe(409);
  });
});

describe('PUT /api/item', function () {
  beforeEach(async () => {
    // Clean up the Item model before each test
    await Item.destroy({ where: {}, truncate: true });
  });

  it('Normal valid with description (200)', async function () {
    Item.update.mockResolvedValueOnce([1]); // Simulate successful update
    const response = await api.put('/api/item/1').send(mockUpdateItem).expect('Content-Type', /application\/json/);
    expect(response.status).toBe(200);
  });

  it('Normal valid with name (200)', async function () {
    Item.update.mockResolvedValueOnce([1]); // Simulate successful update
    const response = await api.put('/api/item/1').send(mockUpdateItem1).expect('Content-Type', /application\/json/);
    expect(response.status).toBe(200);
  });

  it('try to update two lines same time (400)', async function () {
    Item.update.mockRejectedValueOnce(new Error('Invalid Request body'));
    const response = await api.put('/api/item/1').send(mockUpdateItemInvalid).expect('Content-Type', /application\/json/);
    expect(response.status).toBe(400);
  });

  it('Invalid id (500)', async function () {
    Item.update.mockRejectedValueOnce({
      name: 'SequelizeDatabaseError',
      message: 'invalid input syntax for type integer: "kissa"',
      parent: {
        code: '22P02', // PostgreSQL error code for invalid input syntax
        message: 'invalid input syntax for type integer: "kissa"',
      },
    });
    await api.put('/api/item/kissa').send(mockUpdateItem).expect(500);
  });

  
  it('should return 400 for invalid update request', async function () {
    const invalidUpdate = { invalidKey: 'test' }; // Missing required fields
    const response = await api.put('/api/item/1').send(invalidUpdate);
    expect(response.status).toBe(400);
  });
    
  
});

describe('DELETE /api/item', function () {
  it('should delete an item successfully', async () => {
    Item.destroy.mockResolvedValueOnce(1); // Simulate successful deletion
    const response = await api.delete(`/api/item/1`).expect(200);
    expect(response.body.message).toBe('Item deleted');
  });

  it('should return 404 when item is not found', async () => {
    const itemId = 999; // Non-existing item

    Item.destroy.mockResolvedValueOnce(0);
    const response = await api.delete(`/api/item/${itemId}`).expect(404);
    expect(response.body.error).toBe('Item not found');
  });

  it('Pass param id string (500)', async () => {
    Item.destroy.mockRejectedValueOnce(new Error('Invalid input syntax for type integer'));
    await api.delete(`/api/item/kissa`).expect(500);
  });
  it('should return 500 if database error occurs during deletion', async function () {
    Item.destroy.mockRejectedValueOnce(new Error('Database error'));
    await api.delete(`/api/item/1`).expect(500);
  });
  
});