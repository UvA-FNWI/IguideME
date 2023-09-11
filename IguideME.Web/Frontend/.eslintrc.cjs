module.exports = {
	root: true,
	env: {
		browser: true,
		es2021: true,
	},
	extends: ['eslint:recommended', 'standard-with-typescript', 'plugin:react/recommended', 'prettier'],
	overrides: [
		{
			env: {
				node: true,
			},
			files: ['.eslintrc.{js,cjs}'],
			parserOptions: {
				sourceType: 'script',
			},
		},
	],
	// exclude: ['.eslintrc.cjs'],
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
		// project: true,
		// tsconfigRootDir: path.join(__dirname, 'src'),
	},
	plugins: ['react', 'react-refresh', '@typescript-eslint', 'prettier'],
	rules: {
		'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
		'@typescript-eslint/no-non-null-assertion': 'off',
		'react/react-in-jsx-scope': 'off',
		'react/jsx-uses-react': 'off',
	},
};
