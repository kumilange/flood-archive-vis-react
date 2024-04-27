export default {
	testEnvironment: 'jsdom',
	// testEnvironment: "jest-environment-jsdom-sixteen",
	transform: {
		'^.+\\.tsx?$': 'ts-jest',
	},
	setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
	transformIgnorePatterns: [
		'/node_modules/(?!maplibre-gl-opacity)',
		'/node_modules/(?!maplibre-gl)',
	],
	moduleNameMapper: {
		'\\.(css|less|sass|scss)$': 'identity-obj-proxy',
		'^.+\\.svg$': 'jest-transformer-svg',
		'^maplibre-gl$': '<rootDir>/node_modules/maplibre-gl/dist/maplibre-gl.js',
		// '^maplibre-gl-opacity$': '<rootDir>/node_modules/maplibre-gl-opacity/dist/maplibre-gl-opacity.js',
	},
};
