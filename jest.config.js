/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/src/**/?(*.)+(spec|test).[tj]s?(x)'],
  verbose: true,
  transform: {
    '^.+\\.[jt]s?$': [
      'ts-jest',
      {
        tsConfig: 'tsconfig.spec.json',
        isolatedModules: false,
      },
    ],
  },
  moduleFileExtensions: [`js`, `jsx`, `ts`, `tsx`, `json`],
  watchPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/setupTests.js'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/**/*.{js,ts,tsx,jsx}'],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
}
