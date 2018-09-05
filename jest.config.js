module.exports = {
  verbose: false,
  testPathIgnorePatterns: [
    '/server/test',
    '/node_modules/',
    '/dist/',
    '/client/__mocks__',
    '/client/src/store/',
  ],
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',
  },
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.{js,jsx}', '!webpack.*.js', '!jest.config.js',
    '!**/configureStore.js',
  ],
  coveragePathIgnorePatterns: [
    '/server/', '/UI/', '/coverage/', '/dist/', '/node_modules/',
    '/client/src/store/',
  ],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  setupTestFrameworkScriptFile: './client/src/test/setupTests.js',
  setupFiles: ['jest-localstorage-mock'],
  testURL: 'http://localhost',
};
