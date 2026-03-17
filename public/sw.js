const CACHE_NAME = 'saberpro-cache-v2';
const ASSETS_TO_CACHE = [
    '/manifest.json',
    '/icon.svg'
];

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    // Strategy: Network First for HTML and dynamic requests, Cache First for static assets
    const isNavigation = event.request.mode === 'navigate';
    const isNextStatic = event.request.url.includes('/_next/static/');

    if (isNavigation || !isNextStatic) {
        event.respondWith(
            fetch(event.request)
                .then(response => response)
                .catch(async () => {
                    const cachedResponse = await caches.match(event.request);
                    if (cachedResponse) return cachedResponse;
                    
                    // Fallback for navigation failures (offline)
                    if (isNavigation) {
                         return caches.match('/');
                    }
                    
                    // Return a 404 response instead of undefined to avoid SW crash
                    return new Response('Offline: Resource not found', {
                        status: 404,
                        statusText: 'Not Found',
                        headers: new Headers({ 'Content-Type': 'text/plain' })
                    });
                })
        );
    } else {
        event.respondWith(
            caches.match(event.request).then((response) => {
                return response || fetch(event.request).catch(() => {
                    return new Response('Static asset not found', { status: 404 });
                });
            })
        );
    }
});
