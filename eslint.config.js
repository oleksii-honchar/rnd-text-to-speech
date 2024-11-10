const globals = require('globals');
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const eslintPrettier = require('eslint-plugin-prettier');

module.exports = tseslint.config(
  {
    ignores: [
      '**/.history/**',
      '**/dist/**',
      '**/node_modules/**',
      '**/coverage/**',
      '**/*.d.ts',
      '.prettierrc.js',
      'eslint.config.js',
      'jest.config.js',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,
  require('eslint-config-prettier'),
  {
    files: ['src/**/*.js', 'src/**/*.ts'],
    plugins: {
      'typescript-eslint': tseslint.plugin,
      prettier: eslintPrettier,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      parser: tseslint.parser,
      parserOptions: {
        project: true,
      },
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },
  {
    files: ['**/*.md'],
    plugins: {
      markdown: require('eslint-plugin-markdown'),
    },
    processor: 'markdown/markdown',
  },
);
