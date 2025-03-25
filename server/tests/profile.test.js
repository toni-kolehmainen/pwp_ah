// hal ->
// profile/index ->
// controller/profile ->

const supertest = require('supertest');
const { dbSync } = require('../models'); // models
const { sequelize } = require('../utils/db'); // Import sequelize
const {userProperties, itemProperties, categoryProperties,
      auctionProperties, bidProperties} = require('../static/profiles/index')
const app = require('../app');
// Import your Express app
const api = supertest(app);

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
  jest.clearAllMocks();
});

afterAll(async () => {
  sequelize.close();
});

describe('GET /profile ', () => {

  beforeEach(() => {
    // Clean up the User model before each test
    jest.clearAllMocks();
  });

  it('get profile of bids', async () => {
    const response = await api.get('/profile/bids').expect(200).expect('Content-Type', /application\/json/);
    const body = response.body;
    // Check for _links
    expect(body).toHaveProperty('_links');
    expect(body._links).toHaveProperty('self');
    expect(body._links).toHaveProperty('item');
    expect(body._links.self).toHaveProperty('href', '/profile/bids');
    expect(body._links.item).toHaveProperty('href', '/api/bids/:bid_id');

    // Check for properties
    expect(body).toHaveProperty('properties');
    expect(body).toHaveProperty('properties', bidProperties);


    // Check for actions
    expect(body).toHaveProperty('actions');
    expect(body.actions[0]).toHaveProperty('name', "create");
    expect(body.actions[1]).toHaveProperty('name', "get all");
    expect(body.actions[2]).toHaveProperty('name', "get single");
    expect(body.actions[3]).toHaveProperty('name', "delete");
  });
  it('get profile of auctions', async () => {
    const response = await api.get('/profile/auctions')
        .expect(200)
        .expect('Content-Type', /application\/json/);
    
    const body = response.body;

    // Check for _links
    expect(body).toHaveProperty('_links');
    expect(body._links).toHaveProperty('self');
    expect(body._links).toHaveProperty('item');
    expect(body._links.self).toHaveProperty('href', '/profile/auctions');
    expect(body._links.item).toHaveProperty('href', '/api/auctions/:id');

    // Check for properties
    expect(body).toHaveProperty('properties');
    expect(body).toHaveProperty('properties', auctionProperties); // Ensure auctionProperties is defined in the test setup

    // Check for actions
    expect(body).toHaveProperty('actions');
    expect(body.actions[0]).toHaveProperty('name', "create");
    expect(body.actions[1]).toHaveProperty('name', "get all");
    expect(body.actions[2]).toHaveProperty('name', "get single");
    expect(body.actions[3]).toHaveProperty('name', "delete");
  });

  it('get profile of categories', async () => {
    const response = await api.get('/profile/categories')
        .expect(200)
        .expect('Content-Type', /application\/json/);
    
    const body = response.body;

    // Check for _links
    expect(body).toHaveProperty('_links');
    expect(body._links).toHaveProperty('self');
    expect(body._links).toHaveProperty('item');
    expect(body._links.self).toHaveProperty('href', '/profile/categories');
    expect(body._links.item).toHaveProperty('href', '/api/categories/:id');

    // Check for properties
    expect(body).toHaveProperty('properties');
    expect(body).toHaveProperty('properties', categoryProperties); // Ensure categoryProperties is defined in the test setup

    // Check for actions
    expect(body).toHaveProperty('actions');
    expect(body.actions[0]).toHaveProperty('name', "create");
    expect(body.actions[1]).toHaveProperty('name', "get all");
    expect(body.actions[2]).toHaveProperty('name', "get single");
    expect(body.actions[3]).toHaveProperty('name', "delete");
  });

  it('get profile of items', async () => {
    const response = await api.get('/profile/items').expect(200);
    const body = response.body;

    // Check for _links
    expect(body).toHaveProperty('_links');
    expect(body._links).toHaveProperty('self');
    expect(body._links).toHaveProperty('item');
    expect(body._links.self).toHaveProperty('href', '/profile/items');
    expect(body._links.item).toHaveProperty('href', '/api/items/:id');

    // Check for properties
    expect(body).toHaveProperty('properties');
    expect(body).toHaveProperty('properties', itemProperties);

    // Check for actions
    expect(body).toHaveProperty('actions');
    expect(body.actions[0]).toHaveProperty('name', "create");
    expect(body.actions[1]).toHaveProperty('name', "get all");
    expect(body.actions[2]).toHaveProperty('name', "get single");
    expect(body.actions[3]).toHaveProperty('name', "delete");
    expect(body.actions[4]).toHaveProperty('name', "update");
  });
  it('get profile of users', async () => {
    const response = await api.get('/profile/users').expect(200);
    const body = response.body;
  
    // Check for _links
    expect(body).toHaveProperty('_links');
    expect(body._links).toHaveProperty('self');
    expect(body._links).toHaveProperty('item');
    expect(body._links.self).toHaveProperty('href', '/profile/users');
    expect(body._links.item).toHaveProperty('href', '/api/users/:user_id');
  
    // Check for properties
    expect(body).toHaveProperty('properties');
    expect(body).toHaveProperty('properties', userProperties); // Ensure userProperties is defined in the test setup
  
    // Check for actions
    expect(body).toHaveProperty('actions');
    expect(body.actions[0]).toHaveProperty('name', "create");
    expect(body.actions[1]).toHaveProperty('name', "get all");
    expect(body.actions[2]).toHaveProperty('name', "get single");
    expect(body.actions[3]).toHaveProperty('name', "delete");
    expect(body.actions[4]).toHaveProperty('name', "update");
  });
  it('get profile of no-match', async () => {
    const response = await api.get('/profile/test').expect(404);
    const body = response.body;
    expect(body).toHaveProperty('message', "Resource not found");
    
  });
});