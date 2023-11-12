 // importing various workbox strategies and utilities for service worker functionality.
const { offlineFallback, warmStrategyCache } = require('workbox-recipes');
const { CacheFirst, StaleWhileRevalidate } = require('workbox-strategies');
const { registerRoute } = require('workbox-routing');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const { ExpirationPlugin } = require('workbox-expiration');
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');


// Precaching files that are part of the webpack build process
precacheAndRoute(self.__WB_MANIFEST);

// CacheFirst strategy for pages to quickly load previously visited pages.
const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
    // ensures only responses with cetian statuses are catched.
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    // Automatically remove old cache entries.
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60, // cache item for 30 days.
    }),
  ],
});
// Preload and cache pages to ensure they are available offline.
warmStrategyCache({
  urls: ['/index.html', '/'], // urls to catch
  strategy: pageCache, // Strategy to use
});
// Registering a route for navigation requests to sue the CacheFirst strategy.
registerRoute(({ request }) => request.mode === 'navigate', pageCache);

// TODO: Implement asset caching

registerRoute(
  ({ request }) => ["style", "script", "worker"].includes(request.destination),
  new StaleWhileRevalidate({
    cacheName: "asset-cache",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);