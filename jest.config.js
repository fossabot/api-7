module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts', '!src/index.ts'],
  preset: 'ts-jest',
  restoreMocks: true,
  testEnvironment: 'node',
}
