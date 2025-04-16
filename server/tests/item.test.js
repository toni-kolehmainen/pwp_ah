const supertest = require('supertest');
const { dbSync, Item } = require('../models'); // models
const { sequelize } = require('../utils/db'); // Import sequelize
const app = require('../app');
// Import Express app
const api = supertest(app);
const {
  mockItem, mockItemWrong, mockUpdateItem, mockUpdateItemInvalid, mockUpdateItem1
} = require('./data');

jest.mock('express-rate-limit', () => jest.fn().mockImplementation(() => (req, res, next) => {
  next(); // Mocking the rate-limiting middleware without enforcing limits
}));

jest.mock('../models', () => {
  const mockModel = {
    findAll: jest.fn(), // Return the mock item
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(), // Assuming one row updated
    destroy: jest.fn() // Assuming one row deleted
  };

  return {
    Item: mockModel,
    User: mockModel,
    Category: mockModel,
    Auction: mockModel,
    Bid: mockModel,
    dbSync: jest.fn()
  };
});

const mockItemUpdate = {
  id:1,
  name: 'Sample Item',
  description: 'This is a sample item.',
  userId: 1,
  categoryId: 1,
  toJSON: jest.fn().mockReturnValue({
    id:1,
    name: 'Sample Item',
    description: 'This is a sample item.',
    userId: 1,
    categoryId: 1,
  })
};

// You need to wait for the database models to create.
beforeAll(async () => {
  await dbSync();
  //await Item.destroy({ where: {} });
  console.log('Database is synced before running tests');
});

afterAll(async () => {
  await sequelize.close();
});

describe('GET /api/item item', () => {
  beforeEach(async () => {
    // Clean up the Item model before each test
    await Item.destroy({ where: {}, truncate: true });
  });

  it('Normal get (200)', async () => {
    Item.findOne.mockResolvedValue(mockItem);
    const response = await api.get('/api/items/1').expect(200).expect('Content-Type', /application\/json/);
    const body = response.body;

    // Check for _links
    expect(body).toHaveProperty('_links');
    expect(body._links).toHaveProperty('self');
    expect(body._links.self).toHaveProperty('href', `/api/items/${mockItem.id}`);
    expect(body._links).toHaveProperty('delete');
    expect(body._links.delete).toHaveProperty('href', `/api/items/${mockItem.id}`, "method", "DELETE");
    expect(body._links).toHaveProperty('edit');
    expect(body._links.edit).toHaveProperty('href', `/api/items/${mockItem.id}`, "method", "PUT");
    expect(body._links).toHaveProperty('profile');
    expect(body._links.profile).toHaveProperty('href', '/profiles/items');
    expect(body._links).toHaveProperty('all');
    expect(body._links.all).toHaveProperty('href', '/api/items');
    
    // check for data values mathcing the mockUser
    expect(body).toHaveProperty('name', mockItem.name);
    expect(body).toHaveProperty('description', mockItem.description);
    expect(body).toHaveProperty('userId', mockItem.userId);
    expect(body).toHaveProperty('categoryId', mockItem.categoryId);
  });

  it('empty get (404)', async () => {
    Item.findOne.mockResolvedValue(null);
    const response = await api.get('/api/items/999').expect(404);
    expect(response.body).toEqual({ error: 'Item not found' });
});

  it('Param is not int (500)', async () => {
    Item.findOne.mockRejectedValueOnce(new Error('Invalid input syntax for type integer'));
    await api.get('/api/items/kissa').expect(500);
  });
});


describe('PUT /api/item', () => {
  beforeEach(async () => {
    // Clean up the Item model before each test
    await Item.destroy({ where: {}, truncate: true });
  });

  it('Normal valid with description (200)', async () => {
    Item.update.mockResolvedValueOnce([1, mockItemUpdate]); // Simulate successful update
    const response = await api.put('/api/items/1').send(mockUpdateItem).expect('Content-Type', /application\/json/);
    expect(response.status).toBe(200);
  });

  it('Normal valid with name (200)', async () => {
    Item.update.mockResolvedValueOnce([1, mockItemUpdate]); // Simulate successful update
    const response = await api.put('/api/items/1').send(mockUpdateItem1).expect('Content-Type', /application\/json/);
    expect(response.status).toBe(200);
  });

  it('Invalid id (500)', async () => {
    Item.update.mockRejectedValueOnce({
      name: 'SequelizeDatabaseError',
      message: 'invalid input syntax for type integer: "kissa"',
      parent: {
        code: '22P02', // PostgreSQL error code for invalid input syntax
        message: 'invalid input syntax for type integer: "kissa"'
      }
    });
    await api.put('/api/items/kissa').send(mockUpdateItem).expect(500);
  });

  it('should return 400 for invalid update request', async () => {
    const invalidUpdate = { invalidKey: 'test' }; // Missing required fields
    const response = await api.put('/api/items/1').send(invalidUpdate);
    expect(response.status).toBe(400);
  });
  it('should return 404 not found', async () => {
    Item.update.mockResolvedValueOnce([0, mockItemUpdate]); // Simulate successful update
    const response = await api.put('/api/items/200').send(mockUpdateItem1);
    expect(response.status).toBe(404);
  });
});

describe('DELETE /api/item', () => {
  it('should delete an item successfully', async () => {

    Item.destroy.mockResolvedValueOnce(mockItemUpdate); // Simulate successful deletion
    const response = await api.delete('/api/items/1').expect(200);
    const body = response.body;

    // Check for _links
    expect(body).toHaveProperty('_links');
    expect(body._links).toHaveProperty('self');
    expect(body._links).toHaveProperty('create');
    expect(body._links.create).toHaveProperty('href', '/api/items');
    expect(body._links.profile).toHaveProperty('href', '/profiles/items');
    expect(body).toHaveProperty('message', `Deleted successfully from items`);
  });

  it('should return 404 when item is not found', async () => {
    const itemId = 999; // Non-existing item

    Item.destroy.mockResolvedValueOnce(0);
    const response = await api.delete(`/api/items/${itemId}`).expect(404);
    expect(response.body.error).toBe('Item not found');
  });

  it('Pass param id string (500)', async () => {
    Item.destroy.mockRejectedValueOnce(new Error('Invalid input syntax for type integer'));
    await api.delete('/api/items/kissa').expect(500);
  });
  it('should return 500 if database error occurs during deletion', async () => {
    Item.destroy.mockRejectedValueOnce(new Error('Database error'));
    await api.delete('/api/items/1').expect(500);
  });
});
