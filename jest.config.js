module.exports = {
  preset: 'ts-jest',
  coverageDirectory: "coverage",
  testEnvironment: 'enzyme',
  setupFilesAfterEnv: [
    'jest-enzyme',
  ],
  testRegex: '\\.test\\.(js|ts)x?$',
  testEnvironmentOptions: {
    enzymeAdapter: 'react16',
  },
  transform: {
    '^.+\\.tsx?$': '<rootDir>/jest.transformer.js',
    
  },
  testPathIgnorePatterns: [],
  moduleNameMapper: { '^lodash-es$': 'lodash' },
};

