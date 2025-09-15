// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');

module.exports = tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        node: true,
        console: 'readonly',
        process: 'readonly',
        require: 'readonly',
        module: 'readonly',
        exports: 'readonly',
        __dirname: 'readonly',
        URLSearchParams: 'readonly'
      }
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-empty-function': 'warn',
      'no-console': 'warn',
      '@typescript-eslint/no-require-imports': 'off', // Permitir require() en scripts JS
      'no-undef': 'off' // Deshabilitado porque TypeScript maneja esto mejor
    },
    ignores: [
      'dist/**',
      'node_modules/**',
      '*.config.*',
      'coverage/**',
      'sql/**',
      '*.js' // Excluir archivos JS para solo procesar TypeScript
    ]
  }
);
