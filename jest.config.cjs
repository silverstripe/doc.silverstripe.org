module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  roots: ['<rootDir>'],
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  modulePathIgnorePatterns: ['<rootDir>/.cache'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.module\\.css$': 'identity-obj-proxy',
    '\\.css$': 'identity-obj-proxy'
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      useESM: true,
      tsconfig: {
        isolatedModules: false
      }
    }]
  },
  testPathIgnorePatterns: [
    '/node_modules/',
    process.env.RUN_ALERTS_TESTS ? '' : 'alerts.test',
    process.env.RUN_ALERTS_TESTS ? '' : 'links.test',
    process.env.RUN_ALERTS_TESTS ? '' : 'included-versions.test',
  ].filter(Boolean),
  transformIgnorePatterns: [
    'node_modules/(?!(unified|remark|rehype|mdast|hast|micromark|decode-named-character-reference|character-entities|unist-util-visit|unist-util-position|unist-util-position-from-estree|is-plain-obj|bail|ccount|escape-string-regexp|markdown-table|parse-entities|markdown-extensions|space-separated-tokens|comma-separated-tokens|character-reference-invalid|web-namespaces|zwitch|fault|type-fest|hastscript|unist-util-visit-parents|unist-util-is|rehype-slug|rehype-autolink-headings|remark-github-blockquote-alert|vfile|vfile-message|devlop|extend|github-slugger)/)'
  ],
  setupFilesAfterEnv: ['<rootDir>/scripts/setup-tests.js'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.tsx'
  ]
};
