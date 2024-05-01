import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import webfontDownload from 'vite-plugin-webfont-dl';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		webfontDownload([
			'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;600&display=swap',
		]),
	],
});
