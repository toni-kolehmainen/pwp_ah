const supertest = require('supertest');
const { dbSync, User } = require('../models'); // models
const { sequelize } = require('../utils/db'); // Import sequelize
const app = require('../app');


// Import your Express app
const api = supertest(app);
const {
  mockUser, mockUserWrong
} = require('./data');

const addMockUser = {
  name: 'John Doe',
  nickname: 'Johnny',
  email: 'john.doe@example.com',
  phone: '123-456-7890',
  password: 'hashedpassword123',
  toJSON: jest.fn().mockReturnValue({
    name: 'John Doe',
    nickname: 'Johnny',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    password: 'hashedpassword123'
  })
};

// Mock the models with the imported mocks
jest.mock('../models', () => {
  const mockModel = {
    findAll: jest.fn(), // Return the mock user
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(), // Assuming one row updated
    destroy: jest.fn() // Assuming one row deleted
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
describe('POST /api users', () => {
  beforeEach(async () => {
    // Clean up the User model before each test
    await User.destroy({ where: {}, truncate: true });
    jest.clearAllMocks();
  });
  it('Default valid (201) userspost', async () => {
    
    User.create.mockResolvedValueOnce(addMockUser);
    // Make the POST request
    const response = await api
      .post('/api/users')
      .send(addMockUser);
    expect(response.status).toBe(201);
  });
  it('Email unique constraint (409)', async () => {
    User.create.mockResolvedValueOnce(addMockUser);
    await api.post('/api/users')
      .send(addMockUser)
      .expect('Content-Type', /application\/json/)
      .expect(201);

    User.create.mockRejectedValueOnce({
      name: 'SequelizeUniqueConstraintError', // Ensure the mock includes the correct error type
      code: '23505', // PostgreSQL error code for unique constraint violation
      message: 'duplicate key value violates unique constraint "users_email_key"', // Error message from PostgreSQL
      parent: {
        code: '23505', // The PostgreSQL error code in the parent object
        message: 'duplicate key value violates unique constraint "users_email_key"' // Message from the parent object
      },
      errors: [
        {
          message: 'Email must be unique',
          type: 'unique violation',
          path: 'email', // Path to the field in error
          value: addMockUser.email // The conflicting value
        }
      ]
    });

    const response = await api
      .post('/api/users')
      .send(addMockUser)
      .expect('Content-Type', /application\/json/);
    expect(response.status).toBe(409);
  });
  it('no name should return status (400)', async () => {
    User.create.mockResolvedValueOnce(mockUserWrong);
    // Make the POST request
    const response = await api
      .post('/api/users')
      .send(mockUserWrong);
    expect(response.status).toBe(400);
  });
});