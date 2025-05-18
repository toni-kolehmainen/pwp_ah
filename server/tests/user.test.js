const supertest = require('supertest');
const { dbSync, User } = require('../models'); // models
const { sequelize } = require('../utils/db'); // Import sequelize
const app = require('../app');
// Import Express app
const api = supertest(app);
const {
  mockUser, mockUserWrong, mockUpdateUser,
  mockUpdateUserInvalid, mockUpdateUser1
} = require('./data');

jest.mock('express-rate-limit', () => jest.fn().mockImplementation(() => (req, res, next) => {
  next(); // Mocking the rate-limiting middleware without enforcing limits
}));

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

// You need to wait for the database models to create.
beforeAll(async () => {
  await dbSync();
  console.log('Database is synced before running tests');
});

afterAll(async () => {
  sequelize.close();
});

describe('GET /api/users/:id user', () => {
  beforeEach(async () => {
    // Clean up the User model before each test
    await User.destroy({ where: {}, truncate: true });
  });

  it('Normal get (200)', async () => {
    User.findOne.mockResolvedValue(mockUser);
    const response = await api.get('/api/users/1').expect(200).expect('Content-Type', /application\/json/);
    const body = response.body;
    // Check for _links
    expect(body).toHaveProperty('_links');
    expect(body._links).toHaveProperty('self');
    expect(body._links.self).toHaveProperty('href', `/api/users/${mockUser.id}`);
    expect(body._links).toHaveProperty('delete');
    expect(body._links.delete).toHaveProperty('href', `/api/users/${mockUser.id}`, "method", "DELETE");
    expect(body._links).toHaveProperty('edit');
    expect(body._links.edit).toHaveProperty('href', `/api/users/${mockUser.id}`, "method", "PUT");
    expect(body._links).toHaveProperty('profile');
    expect(body._links.profile).toHaveProperty('href', '/profiles/users');
    expect(body._links).toHaveProperty('all');
    expect(body._links.all).toHaveProperty('href', '/api/users');
    
    // check for data values mathcing the mockUser
    expect(body).toHaveProperty('email', mockUser.email);
    expect(body).toHaveProperty('name', mockUser.name);
    expect(body).toHaveProperty('nickname', mockUser.nickname);
    expect(body).not.toHaveProperty('password');
    expect(body).toHaveProperty('phone', mockUser.phone);
  });
  // it('empty get (404)', async () => {
  //   User.findOne.mockResolvedValue(0);

  it('empty get (404)', async () => {
    User.findOne.mockResolvedValue(null);
    const response = await api.get('/api/users/999').expect(404);
    expect(response.body).toEqual({});
  });

  it('Param is not int (500)', async () => {
    User.findOne.mockRejectedValueOnce(mockUser);
    await api.get('/api/users/kissa').expect(500);
  });
});

describe('PUT /api user', () => {
  beforeEach(async () => {
    // Clean up the User model before each test
    await User.destroy({ where: {}, truncate: true });
  });
  // it('Normal valid with password (200)', async () => {
  //   User.update.mockResolvedValueOnce([1, [mockUser]]);
  //   const response = await api.put('/api/users/1').send(mockUpdateUser).expect('Content-Type', /application\/json/);

  //   expect(response.status).toBe(200);
  // });
  // it('Normal valid with username (200)', async () => {
  //   User.update.mockResolvedValueOnce([1, [mockUser]]);
  //   const response = await api.put('/api/users/1').send(mockUpdateUser1).expect('Content-Type', /application\/json/);
  //   expect(response.status).toBe(200);
  // });
  // it('try to update two lines same time (400)', async () => {
  //   User.update.mockRejectedValueOnce(mockUser);
  //   const response = await api.put('/api/users/1').send(mockUpdateUserInvalid).expect('Content-Type', /application\/json/);
  //   expect(response.status).toBe(400);
  // });
  // it('Invalid id (500)', async () => {
  //   User.update.mockRejectedValueOnce({
  //     name: 'SequelizeDatabaseError',
  //     message: 'invalid input syntax for type integer: "kissa"',
  //     parent: {
  //       code: '22P02', // PostgreSQL error code for invalid input syntax
  //   await User.destroy({ where: {}, truncate: true });
  // });

  it('Normal valid with password (200)', async () => {
    User.update.mockResolvedValue([1, [mockUser]]);
    const response = await api.put('/api/users/1').send(mockUpdateUser).expect('Content-Type', /application\/json/);
    expect(response.status).toBe(200);
  });

  it('Normal valid with username (200)', async () => {
    User.update.mockResolvedValue([1, [mockUser]]);
    const response = await api.put('/api/users/1').send(mockUpdateUser1).expect('Content-Type', /application\/json/);
    expect(response.status).toBe(200);
  });

  it('try to update two lines same time (400)', async () => {
    const invalidBody = {
      name: 'John',
      invalidField: 'test' // Triggers additionalProperties: false
    };
    const response = await api
      .put('/api/users/1')
      .send(invalidBody)
      .expect('Content-Type', /application\/json/);
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Invalid Request body'
    });
  });

  it('Invalid id (500)', async () => {
    User.update.mockRejectedValue({
      name: 'SequelizeDatabaseError',
      message: 'invalid input syntax for type integer: "kissa"',
      parent: {
        code: '22P02',
        message: 'invalid input syntax for type integer: "kissa"'
      }
    });
    await api.put('/api/users/kissa').send(mockUpdateUser).expect(500);
  });
});

describe('DELETE /api user', () => {
  it('should delete a user successfully', async () => {
    User.destroy.mockResolvedValueOnce(mockUser); // Simulate successful deletion
    const response = await api
      .delete('/api/users/1')
      .expect(200);
    
    const body = response.body;

    // Check for _links
    expect(body).toHaveProperty('_links');
    expect(body._links).toHaveProperty('self');
    expect(body._links).toHaveProperty('create');
    expect(body._links.create).toHaveProperty('href', '/api/users');
    expect(body._links.profile).toHaveProperty('href', '/profiles/users');
    expect(body).toHaveProperty('message', `Deleted successfully from users`);
  });

  it('should return 404 when user is not found', async () => {
    const userId = 999; // Non-existing user

    User.destroy.mockResolvedValueOnce(0);
    const response = await api
      .delete(`/api/users/${userId}`)
      .expect(404);
    expect(response.body.error).toBe('User not found');
  });
  it('Pass param id string (500)', async () => {
    User.destroy.mockRejectedValueOnce(0);
    await api
      .delete('/api/users/kissa')
      .expect(500);
  });
});
