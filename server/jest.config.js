// server/jest.config.js
module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>', '<rootDir>/tests'],
  moduleFileExtensions: ['js', 'json'],
  testMatch: [
    '<rootDir>/tests/**/*.test.js'
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    'controllers/**/*.js',
    'models/**/*.js',
    '!**/*.d.ts'
  ],
  coverageDirectory: '<rootDir>/coverage',
};
