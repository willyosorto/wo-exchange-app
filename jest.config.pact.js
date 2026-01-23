module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/contract/**/*.pact.spec.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        types: ['jest', 'node'],
      }
    }]
  },
  testTimeout: 30000,
  setupFilesAfterEnv: ['<rootDir>/tests/contract/setup.ts'],
  globals: {
    'ts-jest': {
      isolatedModules: true
    }
  }
};
