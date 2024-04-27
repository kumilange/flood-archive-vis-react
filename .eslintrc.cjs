module.exports = {
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint', 'react', 'jsx-a11y', 'import', 'react-hooks'],
	extends: [
		'airbnb-typescript',
		'plugin:@typescript-eslint/recommended',
		'plugin:react/recommended',
		'plugin:jsx-a11y/recommended',
		'plugin:react-hooks/recommended',
		'plugin:react/jsx-runtime',
		'prettier',
	],
	settings: {
		react: {
			version: 'detect',
		},
	},
	parserOptions: {
		project: ['./tsconfig.json', './.eslintrc.cjs'],
	},
	rules: {
		'react-hooks/rules-of-hooks': 'error',
		'react-hooks/exhaustive-deps': 'warn',
		'import/named': 'off',
		'import/no-unresolved': 'off',
		'import/no-duplicates': ['warn', { 'prefer-inline': true }],
		'import/consistent-type-specifier-style': ['warn', 'prefer-inline'],
		'import/order': [
			'warn',
			{
				alphabetize: { order: 'asc', caseInsensitive: true },
				groups: [
					'builtin',
					'external',
					'internal',
					'parent',
					'sibling',
					'index',
				],
			},
		],
		'@typescript-eslint/interface-name-prefix': 'off',
		'@typescript-eslint/ban-types': 'off',
		'@typescript-eslint/class-name-casing': 'off',
		'@typescript-eslint/no-use-before-define': 'off',
		'@typescript-eslint/camelcase': 'off',
		'@typescript-eslint/no-loss-of-precision': 'off',
		'@typescript-eslint/no-empty-function': 'off',
		'@typescript-eslint/ban-ts-comment': 'off',
		'@typescript-eslint/no-var-requires': 'off',
	},
	overrides: [
		{
			settings: {
				jest: {
					version: latest,
				},
			},
		},
		// {
		//   "files": ["**/*.test.ts",
		// 	"**/*.test.tsx",],
		//   "env": {
		//     "jest": true
		//   }
		// }
	],
};
