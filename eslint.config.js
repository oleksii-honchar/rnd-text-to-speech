const globals = require('globals');
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');

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
  {
    files: ['src/**/*.js', 'src/**/*.ts'],
    plugins: {
      'typescript-eslint': tseslint.plugin,
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
      'object-curly-spacing': 'off',
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
