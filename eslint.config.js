import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

// Frontend packages that follow the "components + arrow functions" house style.
const FRONTEND_GLOBS = ['ui/**/*.{ts,tsx}', 'features/**/*.{ts,tsx}', 'extension/**/*.{ts,tsx}'];

// App code (feature + extension surfaces) must compose shadcn/custom components,
// never raw HTML. The design-system primitives in `ui/` are the one allowed
// place to render bare elements, so they are intentionally excluded here.
const APP_GLOBS = ['features/**/*.tsx', 'extension/**/*.tsx'];

// Lowercase JSX identifiers are intrinsic HTML elements; capitalized ones are
// components. Flag the former so only components are rendered in app code.
const NO_RAW_HTML = {
  selector: 'JSXOpeningElement > JSXIdentifier[name=/^[a-z]/]',
  message:
    'Use shadcn or custom components (Box, Text, Heading, FormRoot, …) from @apptly/ui instead of raw HTML elements.',
};

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
    // House style for the frontend: define functions as `const x = () => …`,
    // never `function x() {}` (declarations or named expressions).
    files: FRONTEND_GLOBS,
    rules: {
      'func-style': ['error', 'expression'],
      'prefer-arrow-callback': 'error',
    },
  },
  {
    files: APP_GLOBS,
    rules: {
      'no-restricted-syntax': ['error', NO_RAW_HTML],
    },
  },
  // Keep ESLint out of Prettier's lane (must stay last).
  prettier,
);
