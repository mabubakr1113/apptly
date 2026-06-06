import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/.wxt/**',
      '**/.output/**',
      '**/.wrangler/**',
      '**/dist/**',
      '**/coverage/**',
      '**/*.d.ts',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      // Security: discourage leaking values through dynamic code execution.
      'no-eval': 'error',
      'no-implied-eval': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-imports': 'warn',
    },
  },
  {
    // House style for the design system: define functions as `const x = () => …`,
    // never `function x() {}` (declarations or named expressions). The same rule
    // is extended to the app packages when they land.
    files: ['ui/**/*.{ts,tsx}'],
    rules: {
      'func-style': ['error', 'expression'],
      'prefer-arrow-callback': 'error',
    },
  },
  // Keep ESLint out of Prettier's lane (must stay last).
  prettier,
);
