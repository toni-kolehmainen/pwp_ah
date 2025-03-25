const request = require('supertest');
const express = require('express');
const { getItems, addItem } = require('../controllers/items'); // Import your controller
const { sequelize } = require('../utils/db'); // Import sequelize
const { Item, dbSync  } = require('../models'); // Mocking the Item model
const { createHalLinks, createHalEmbedded } = require('../utils/hal');
const {
  mockItem, mockItemWrong, mockUpdateItem, mockUpdateItemInvalid, mockUpdateItem1
} = require('./data');
jest.mock('../models'); // Mocking the models
jest.mock('../utils/hal'); // Mocking HAL utilities

// const app = express();
// app.use(express.json());
// app.get('/api/items', getItems);
// app.post('/api/items', addItem);
const app = require('../app');  // Make sure to require the actual Express app
beforeAll(async () => {
  await dbSync(); // Sync the database
  await Item.destroy({ where: {} });
  console.log('Database is synced before running tests');
});

afterAll(async () => {
  sequelize.close();
});
beforeEach(() => {
  jest.clearAllMocks(); // Clears any previous mock calls
});

describe('Item Controller', () => {
  describe('GET /api/items', () => {
    beforeEach(async () => {
      // Clean up the Item model before each test
      await Item.destroy({ where: {}, truncate: true });
      jest.clearAllMocks(); // Clears any previous mock calls
    });

    it('should return 204 when no items are found', async () => {
      // Mocking Item.findAll to return an empty array
      Item.findAll = jest.fn().mockResolvedValueOnce([]);

      const response = await request(app).get('/api/items');

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    });

    it('should return 200 and a list of items', async () => {
      // Mocking Item.findAll to return a list of items
      const mockItems = [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }];
      Item.findAll.mockResolvedValueOnce(mockItems);
      createHalEmbedded.mockReturnValue({ embedded: 'mock' }); // Mock embedded response

      const response = await request(app).get('/api/items');

      expect(response.status).toBe(200);
      expect(response.body._links).toHaveProperty('self');
      expect(response.body._embedded.items).toHaveLength(2); // Two items returned
      expect(createHalEmbedded).toHaveBeenCalledTimes(2); // Called for each item
    });
  });

  describe('POST /api/items itemspost', () => {
    beforeEach(async () => {
      // Clean up the Item model before each test
      await Item.destroy({ where: {}, truncate: true });
    });
    it('should create a new item and return 201', async () => {
      // Mocking successful validation and item creation
      const newItem = { name: 'New Item', sellerId: 1, categoryId: 2, description: 'Description' };
      const createdItem = { id: 1, ...newItem };
      Item.create.mockResolvedValue(createdItem);
      createHalLinks.mockReturnValue({ _links: 'mocked' });

      const response = await request(app)
        .post('/api/items')
        .send(newItem);
      expect(response.status).toBe(201);
      expect(response.body._links).toBe('mocked');
      expect(Item.create).toHaveBeenCalledWith(newItem);
      expect(createHalLinks).toHaveBeenCalled();
    });

    it('should return 400 for invalid request body', async () => {
      const invalidItem = {
        "name": "Invalid Item", 
        "description": "No sellerId or categoryId"
      }

      const response = await request(app)
        .post('/api/items')
        .set('Accept', 'application/json') // Set content type to json
        .send(invalidItem);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid Request body');
    });

    it('should return 500 if item creation fails', async () => {
      // Mocking a failure during item creation
      const newItem = { name: 'New Item', sellerId: 1, categoryId: 2, description: 'Description' };
      Item.create.mockRejectedValue(new Error('Item creation failed'));

      const response = await request(app)
        .post('/api/items')
        .send(newItem);

      expect(response.status).toBe(500);
    });
  });
});

describe('GET /api/items Controller', () => {
  beforeEach(async () => {
    // Clean up the Item model before each test
    await Item.destroy({ where: {}, truncate: true });
    jest.clearAllMocks(); // Clears any previous mock calls
  });

  it('should return 500 if an error occurs', async () => {
    // Mocking Item.findAll to throw an error
    Item.findAll = jest.fn().mockRejectedValueOnce(new Error('Database error'));

    const response = await request(app).get('/api/items');

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Internal Server Error');
  });
});