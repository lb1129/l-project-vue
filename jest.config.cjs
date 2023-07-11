module.exports = {
  roots: ['<rootDir>/src'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
  transform: {
    '.+\\.(css|styl|less|sass|scss|jpg|jpeg|png|svg|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|avif)$':
      'jest-transform-stub',
    '^.+\\.vue$': '@vue/vue2-jest',
    '^.+\\.(t|j)sx?$': 'babel-jest'
  },
  transformIgnorePatterns: ['node_modules/(?!(lodash-es))']
}
