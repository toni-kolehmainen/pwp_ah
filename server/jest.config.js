module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  silent: true, // removes all console log!!!
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/tests/',
    '/utils/db',
    '/models/index',
    '/services/', // Ignore because it contains auxiliary functions and is not a test file
    'app.js' // Ignore because it contains auxiliary functions and is not a test file
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov']
};
