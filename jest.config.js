module.exports = {
  coverageReporters: ['json', 'lcov', 'text', 'html'],
  globals: {
    collectCoverageFrom: ['src/**/*.ts'],
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  moduleDirectories: ['node_modules', '<rootDir>'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
        diagnostics: false,
        isolatedModules: true,
      },
    ],
  },
  testEnvironment: 'node',
  preset: 'ts-jest',
};
