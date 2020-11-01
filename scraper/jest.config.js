module.exports = {
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
      diagnostics: false
    }
  },
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  testRegex: '.*/src/.*\\.test\\.ts',
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/jest.setup.js']
}
