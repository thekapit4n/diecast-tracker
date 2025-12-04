import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';

/**
 * Precache static assets
 */
precacheAndRoute(self.__WB_MANIFEST || []);

/**
 * Cache API requests with network-first strategy
 */
registerRoute(
	({ url }) => url.pathname.startsWith('/api/'),
	new NetworkFirst({
		cacheName: 'api-cache',
		networkTimeoutSeconds: 3
	})
);

/**
 * Cache images with cache-first strategy
 */
registerRoute(
	({ request }) => request.destination === 'image',
	new CacheFirst({
		cacheName: 'images-cache',
		plugins: [
			{
				cacheKeyWillBeUsed: async ({ request }) => {
					return request.url;
				}
			}
		]
	})
);

/**
 * Cache static assets with stale-while-revalidate
 */
registerRoute(
	({ request }) =>
		request.destination === 'style' ||
		request.destination === 'script' ||
		request.destination === 'worker',
	new StaleWhileRevalidate({
		cacheName: 'static-resources'
	})
);

/**
 * Handle offline fallback
 */
self.addEventListener('fetch', (event) => {
	if (event.request.mode === 'navigate') {
		event.respondWith(
			fetch(event.request).catch(() => {
				return caches.match('/');
			})
		);
	}
});

