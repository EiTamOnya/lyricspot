// Taken from https://www.flaskpwa.com/#_serviceWorkersRegistration
const CACHE_NAME = 'static-cache';

const FILES_TO_CACHE = [
    '/',
    '/static/offline.html',
    '/static/mystyles.css',
    '/static/lightstyles.css',
    '/static/darkstyles.css',
    '/static/ajax-loader-light.gif',
    '/static/ajax-loader-dark.gif',
    'static/serviceWorker.js'
];

self.addEventListener('install', (evt) => {
    console.log('[ServiceWorker] Install');
    evt.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[ServiceWorker] Pre-caching offline page');
            return cache.addAll(FILES_TO_CACHE);
        })
    );

    self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
    console.log('[ServiceWorker] Activate');
    evt.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (evt) => {
    if (evt.request.mode !== 'navigate') {
        return;
    }
    evt.respondWith(fetch(evt.request).catch(() => {
        return caches.open(CACHE_NAME).then((cache) => {
            return cache.match('/static/offline.html');
        });
    })
    );
});