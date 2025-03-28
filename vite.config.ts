import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import webfontDownload from 'vite-plugin-webfont-dl';
import path from 'path';

export default defineConfig({
	plugins: [
		react(),
		webfontDownload([
			'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;600&display=swap',
			'https://fonts.googleapis.com/css2?family=Titillium+Web:ital,wght@0,200;0,300;0,400;0,600;0,700;0,900;1,200;1,300;1,400;1,600;1,700&display=swap',
		]),
	],
	// Add optimizeDeps configuration to handle ESM/CJS compatibility issues
	optimizeDeps: {
		include: ['jotai', 'react-map-gl'],
		exclude: [
			'@loaders.gl/worker-utils',
			'@loaders.gl/json',
			'@loaders.gl/core',
		],
		esbuildOptions: {
			target: 'es2020',
		},
	},
	// Resolve Node.js specific modules
	resolve: {
		alias: {
			// Provide empty implementations for Node-specific modules
			child_process: path.resolve(__dirname, './src/empty-module.ts'),
		},
	},
	// Updated build options for Vite 5
	build: {
		target: 'es2020',
		outDir: 'dist',
		sourcemap: true,
		rollupOptions: {
			// Externalize problematic dependencies
			external: ['child_process'],
		},
	},
	// Configure Sass with settings to minimize warnings
	css: {
		devSourcemap: true,
		preprocessorOptions: {
			scss: {},
		},
	},
});
