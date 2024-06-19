export default {
	testEnvironment: 'jsdom',
	transform: {
		'^.+\\.tsx?$': 'ts-jest',
	},
	setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
	transformIgnorePatterns: [
		'/node_modules/(?!maplibre-gl-opacity|maplibre-gl|@mapbox/tiny-sdf).+\\.js$',
	],
	moduleNameMapper: {
		'\\.(css|less|sass|scss)$': 'identity-obj-proxy',
		'^.+\\.svg$': 'jest-transformer-svg',
		'^maplibre-gl$': '<rootDir>/node_modules/maplibre-gl/dist/maplibre-gl.js',
	},
};
