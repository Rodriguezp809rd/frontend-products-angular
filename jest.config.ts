import type { Config } from 'jest';

const config: Config = {
  preset: 'jest-preset-angular',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      { tsconfig: '<rootDir>/tsconfig.spec.json' }
    ]
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/app/$1',
    '\\.(html)$': '<rootDir>/src/test/mocks/html.mock.js',
    '\\.(css|scss|sass)$': '<rootDir>/src/test/mocks/style.mock.js'
  },
  collectCoverage: true,
  collectCoverageFrom: [
    'src/app/**/*.ts',
    '!src/app/**/*.spec.ts',

    '!src/main.ts',
    '!src/app/app.config.ts',
    '!src/app/**/*.routes.ts',
    '!src/environments/**',
    '!src/app/**/index.ts',
    '!src/app/**/public-api.ts',


    '!src/app/core/tokens/**',
    '!src/app/domain/usecases/product.repository.ts',
    '!src/app/domain/usecases/**',
    '!src/app/core/ui/toast-container.component.ts',

  ],
  coverageThreshold: {
    global: { branches: 60, functions: 70, lines: 70, statements: 70 }
  }
};
export default config;
