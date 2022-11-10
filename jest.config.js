module.exports = {
  cacheDirectory: ".local/jest/cache",
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: ".local/jest/coverage",
  coverageProvider: "v8",
  roots: [
    "src/js"
  ],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  testEnvironment: 'jsdom',
};
