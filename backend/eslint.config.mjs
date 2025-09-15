// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        ...globals.node,
        console: 'readonly',
        process: 'readonly'
      }
    },
    rules: {
      // TypeScript rules - balanced approach
      '@typescript-eslint/no-explicit-any': 'warn', // Warn but don't fail build
      '@typescript-eslint/no-unused-vars': [
        'error',
        { 
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true
        }
      ],
      '@typescript-eslint/no-empty-function': 'warn',
      '@typescript-eslint/no-unsafe-function-type': 'error',
      
      // General rules - practical for backend development
      'no-console': 'warn', // Allow console in backend for logging
      'no-debugger': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      'no-undef': 'off', // TypeScript handles this better
      
      // Node.js specific
      '@typescript-eslint/no-require-imports': 'off'
    },
    ignores: [
      'dist/**',
      'node_modules/**',
      '*.config.*',
      'coverage/**',
      'sql/**',
      '*.js' // Process only TypeScript files
    ]
  }
);
