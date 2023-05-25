module.exports = {
  envs: ['es2022', 'node'],
  space: true,
  prettier: true,
  rules: {
    'array-element-newline': ['error', 'consistent'],
    'array-bracket-spacing': ['error', 'never'],
    camelcase: ['error', { properties: 'never' }],
    'capitalized-comments': 'off',
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
          'object',
          'type',
        ],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    'import/no-unassigned-import': 'off',
    'import/no-unresolved': ['error', { commonjs: true, amd: true }],
    'max-depth': ['error', 10],
    'max-params': 'off',
    'no-await-in-loop': 'off',
    'object-curly-spacing': ['error', 'always'],
    quotes: ['error', 'single'],
    'quote-props': ['error', 'consistent-as-needed'],
    'unicorn/filename-case': [
      'error',
      { cases: { kebabCase: true, pascalCase: true, camelCase: true } },
    ],
    'unicorn/no-array-reduce': 'off',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.mjs', '.cjs'],
      },
    },
  },
};
