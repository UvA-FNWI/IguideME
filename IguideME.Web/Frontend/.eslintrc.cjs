const { resolve } = require('node:path');

const tsconfig = resolve(__dirname, 'tsconfig.json');

module.exports = {
  extends: [
    'next/core-web-vitals',
    'eslint:recommended',
    'prettier',
    require.resolve('@vercel/style-guide/eslint/node'),
    require.resolve('@vercel/style-guide/eslint/typescript'),
    require.resolve('@vercel/style-guide/eslint/browser'),
    require.resolve('@vercel/style-guide/eslint/react'),
    require.resolve('@vercel/style-guide/eslint/next'),
    require.resolve('@vercel/style-guide/eslint/playwright-test'),
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: tsconfig,
  },
  rules: {
    'import/named': 'off',
    'prefer-interface': 'off',
    'import/order': 'off',
    'no-nested-ternary': 'off',
    'simple-import-sort/imports': [
      'error',
      {
        // Group layout retrieved from https://github.com/lydell/eslint-plugin-simple-import-sort/blob/main/examples/.eslintrc.js
        groups: [
          // Node.js builtins.
          ['^node:'],
          // Packages. `react` related packages come first.
          ['^react', '^@?\\w'],
          // Internal packages.
          ['^(@|@company|@ui|components|utils|config|vendored-lib)(/.*|$)'],
          // Side effect imports.
          ['^\\u0000'],
          // Parent imports. Put `..` last.
          ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
          // Other relative imports. Put same-folder imports and `.` last.
          ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
          // Style imports.
          ['^.+\\.s?css$'],
        ],
      },
    ],
    'simple-import-sort/exports': 'error',
    'import/no-absolute-path': 'error',
    'import/no-cycle': 'error',
    'import/exports-last': 'error',
    'import/group-exports': 'error',
    'import/newline-after-import': 'error',
    '@dword-design/import-alias/prefer-alias': [
      'error',
      {
        alias: {
          '@': './src',
        },
      },
    ],
    '@typescript-eslint/no-misused-promises': [
      2,
      {
        checksVoidReturn: {
          attributes: false,
        },
      },
    ],
  },
  overrides: [
    {
      files: ['src/**/layout.tsx', 'src/**/page.tsx', 'src/**/not-found.tsx', 'src/**/error.tsx', 'tailwind.config.ts'],
      rules: {
        'import/no-default-export': 'off',
        'import/prefer-default-export': 'error',
      },
    },
  ],
  plugins: ['import', 'simple-import-sort', '@dword-design/import-alias'],
  settings: {
    'import/resolver': {
      typescript: {
        tsconfig,
      },
    },
  },
};
