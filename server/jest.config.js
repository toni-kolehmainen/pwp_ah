module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  silent: true, // removes all console log!!!
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/tests/',
    '/utils/db',
    '/models/index',
    '/services/'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov']
};
