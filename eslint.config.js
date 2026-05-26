const tseslint = require('typescript-eslint')
const prettier = require('eslint-config-prettier')

module.exports = tseslint.config(
  ...tseslint.configs.recommendedTypeChecked,
  prettier,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/require-await': 'off',
    },
  },
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
)
