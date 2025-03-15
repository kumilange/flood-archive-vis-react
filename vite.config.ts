import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import webfontDownload from 'vite-plugin-webfont-dl';

export default defineConfig({
	plugins: [
		react(),
		webfontDownload([
			'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;600&display=swap',
		]),
	],
	// Add optimizeDeps configuration to handle ESM/CJS compatibility issues
	optimizeDeps: {
		include: ['jotai', 'react-map-gl'],
		esbuildOptions: {
			target: 'es2020',
		},
	},
	// Updated build options for Vite 5
	build: {
		target: 'es2020',
		outDir: 'dist',
		sourcemap: true,
	},
});
