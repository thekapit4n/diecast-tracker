import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';

export default defineConfig({
	plugins: [
		sveltekit(),
		SvelteKitPWA({
			srcDir: 'src',
			mode: 'development',
			strategies: 'injectManifest',
			filename: 'service-worker.js',
			scope: '/',
			base: '/',
			manifest: {
				name: 'Diecast Tracker',
				short_name: 'Diecast Tracker',
				description: 'Track your diecast collection',
				theme_color: '#2563eb',
				icons: [
					{
						src: '/favicon.svg',
						sizes: 'any',
						type: 'image/svg+xml'
					}
				]
			},
			injectManifest: {
				globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}']
			},
			devOptions: {
				enabled: true,
				type: 'module'
			}
		})
	]
});
