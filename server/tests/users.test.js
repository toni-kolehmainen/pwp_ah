// test users
// mock when empty
// when content
// not found
// range

const supertest = require('supertest');
const { dbSync, User } = require('../models'); // models
const { sequelize } = require('../utils/db'); // Import sequelize
const app = require('../app');
// Import your Express app
const api = supertest(app);
const { mockUser } = require('./data');

// Mock the models with the imported mocks
jest.mock('../models', () => {
  const mockModel = {
    findAll: jest.fn(),
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
  await dbSync(); // Sync the database
  await User.destroy({ where: {} });
  console.log('Database is synced before running tests');
});

afterAll(async () => {
  sequelize.close();
});

describe('GET /api users', () => {
  it('should return status 204 and empty', async () => {
    User.findAll.mockResolvedValue([]);
    const response = await api.get('/api/users').expect(204);
    expect(response.body).toEqual({});
  });

  it('should return status 200 if mock user created', async () => {
    User.findAll.mockResolvedValue([mockUser]);

    await api.get('/api/users').expect(200).expect('Content-Type', /application\/json/);
  });

  it('should return the mock user', async () => {
    User.findAll.mockResolvedValue([mockUser]);
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
