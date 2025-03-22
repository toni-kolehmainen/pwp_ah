const supertest = require('supertest');
const { dbSync } = require('../models'); // models
const { sequelize } = require('../utils/db'); // Import sequelize
const app = require('../app');
// Import your Express app
const api = supertest(app);
const { mockUser } = require('./data');

jest.mock('../models', () => {
  const { mockUser } = require('./data');
  const mockModel = {
    findAll: jest.fn().mockResolvedValue([mockUser]), // Return the mock user
    findOne: jest.fn().mockResolvedValue(mockUser),
    create: jest.fn().mockResolvedValue(mockUser),
    update: jest.fn().mockResolvedValue([1]), // Assuming one row updated
    destroy: jest.fn().mockResolvedValue(1) // Assuming one row deleted
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

describe('GET /api', () => {
  it('should return status 200 if mock user created', async () => {
    await api.get('/api/users').expect(200).expect('Content-Type', /application\/json/);
  });
  it('should return the mock user', async () => {
    const response = await api.get('/api/users').expect(200);
    const body = response.body;
    
    // Check for _links
    expect(body).toHaveProperty('_links');
    expect(body._links).toHaveProperty('self');
    expect(body._links).toHaveProperty('create');
    expect(body._links.create).toHaveProperty('href', '/api/users');
    expect(body._links.profile).toHaveProperty('href', '/profiles/users/');

    // Check for _embedded and embedded users array
    expect(body).toHaveProperty('_embedded');
    expect(body._embedded).toHaveProperty('users');
    expect(Array.isArray(body._embedded.users)).toBe(true);

    // Check for the properties of the first user in the embedded array
    const user = body._embedded.users[0];
    expect(user).toHaveProperty('_links');
    expect(user._links).toHaveProperty('self');
    expect(user._links.self).toHaveProperty('href', `/api/users/${mockUser.id}`);
    
    // Verify that user has 'email', 'name', and 'nickname'
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('name');
    expect(user).toHaveProperty('nickname');
    
    // Ensure 'href' for delete and edit are present
    expect(user._links).toHaveProperty('delete');
    expect(user._links.delete).toHaveProperty('href', `/api/users/${mockUser.id}`);
    expect(user._links).toHaveProperty('edit');
    expect(user._links.edit).toHaveProperty('href', `/api/users/${mockUser.id}`);
  });
});

beforeAll(async () => {
  await dbSync();
  console.log('Database is synced before running tests');
});

afterAll(async () => {
  sequelize.close();
});
