const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app'); // Your Express app
const { authenticateJWT } = require('../utils/middleware');

jest.mock('jsonwebtoken'); // Mock JWT module

describe('authenticateJWT Middleware', () => {
  let nextMock; let resMock; let
    reqMock;

  beforeEach(() => {
    jest.clearAllMocks();

    reqMock = {
      header: jest.fn(),
      user: undefined
    };
    resMock = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    nextMock = jest.fn();
  });

  test('should call next() for a valid token', () => {
    const mockUser = { id: 1, email: 'test@example.com' };
    reqMock.header.mockReturnValue('Bearer validToken'); // Mock token in header
    jwt.verify.mockReturnValue(mockUser); // Mock successful verification

    authenticateJWT(reqMock, resMock, nextMock);

    expect(jwt.verify).toHaveBeenCalledWith('validToken', process.env.JWT);
    expect(reqMock.user).toEqual(mockUser);
    expect(nextMock).toHaveBeenCalled(); // Ensure next() is called
    expect(resMock.status).not.toHaveBeenCalled(); // No error response
  });

  test('should return 401 if no token is provided', () => {
    reqMock.header.mockReturnValue(null); // No token

    authenticateJWT(reqMock, resMock, nextMock);

    expect(resMock.status).toHaveBeenCalledWith(401);
    expect(resMock.json).toHaveBeenCalledWith({ error: 'Access denied. No token provided.' });
    expect(nextMock).not.toHaveBeenCalled(); // Ensure next() is NOT called
  });

  test('should return 403 if token is invalid', () => {
    reqMock.header.mockReturnValue('Bearer invalidToken');
    jwt.verify.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    authenticateJWT(reqMock, resMock, nextMock);

    expect(resMock.status).toHaveBeenCalledWith(403);
    expect(resMock.json).toHaveBeenCalledWith({ error: 'Invalid token' });
    expect(nextMock).not.toHaveBeenCalled(); // Ensure next() is NOT called
  });
});
