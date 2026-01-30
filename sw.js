// Service Worker for Moowoor Documentation - Offline Support

const CACHE_NAME = 'moowoor-docs-v1.0.3';
const urlsToCache = [
  '/',
  '/index.html',
  '/pages/modules.html',
  '/pages/metiers.html',
  '/pages/gouvernance.html',
  '/pages/parcours-patient.html',
  '/pages/parcours-medicament.html',
  '/pages/parcours-etablissement.html',
  '/pages/parcours-professionnel.html',
  '/pages/about.html',
  '/pages/search.html',
  '/pages/docs.html',
  '/pages/downloads.html',
  '/pages/offline.html',
  '/assets/css/main.css',
  '/assets/css/components.css',
  '/assets/css/animations.css',
  '/assets/css/micro-interactions.css',
  '/assets/css/search.css',
  '/assets/css/careers.css',
  '/assets/css/modules.css',
  '/assets/css/governance.css',
  '/assets/css/journey.css',
  '/assets/css/about.css',
  '/assets/css/docs.css',
  '/assets/css/downloads.css',
  '/assets/js/main.js',
  '/assets/js/animations.js',
  '/assets/js/micro-interactions.js',
  '/assets/js/search.js',
  '/assets/js/modules.js',
  '/assets/js/metiers.js',
  '/assets/js/governance.js',
  '/assets/js/data.js',
  '/assets/js/parcours-patient.js',
  '/assets/js/parcours-medicament.js',
  '/assets/js/parcours-etablissement.js',
  '/assets/js/parcours-professionnel.js',
  '/assets/js/about.js',
  '/assets/js/docs.js',
  '/assets/js/downloads.js',
  '/assets/images/logo-moowoor.svg',
  '/assets/images/hero-bg.svg',
  '/assets/images/pattern.svg'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching all resources');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('[SW] All resources cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Failed to cache resources:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Service worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip external requests
  if (url.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        // Return cached version if available
        if (cachedResponse) {
          // For HTML files, try network first for fresh content
          if (request.destination === 'document') {
            fetchAndCache(request)
              .then((networkResponse) => {
                // Update cache with fresh content
                if (networkResponse && networkResponse.ok) {
                  caches.open(CACHE_NAME).then((cache) => {
                    cache.put(request, networkResponse.clone());
                  });
                }
              })
              .catch(() => {
                // Network failed, continue with cached version
                console.log('[SW] Network failed, serving cached version');
              });
          }
          return cachedResponse;
        }

        // Try network first
        return fetchAndCache(request);
      })
      .catch(() => {
        // If both cache and network fail, return offline page for HTML requests
        if (request.destination === 'document') {
          return caches.match('/pages/offline.html');
        }

        // For other resources, return appropriate fallback
        return new Response('Offline - Resource not available', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: {
            'Content-Type': 'text/plain'
          }
        });
      })
  );
});

// Helper function to fetch and cache
function fetchAndCache(request) {
  return fetch(request)
    .then((response) => {
      // Don't cache non-successful responses
      if (!response || response.status !== 200 || response.type !== 'basic') {
        return response;
      }

      // Clone the response since it can only be consumed once
      const responseToCache = response.clone();

      caches.open(CACHE_NAME)
        .then((cache) => {
          cache.put(request, responseToCache);
        })
        .catch((error) => {
          console.error('[SW] Failed to cache resource:', error);
        });

      return response;
    })
    .catch((error) => {
      console.error('[SW] Network request failed:', error);
      throw error;
    });
}

// Background sync for when connection is restored
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('[SW] Background sync triggered');
    event.waitUntil(doBackgroundSync());
  }
});

// Background sync implementation
function doBackgroundSync() {
  return self.clients.matchAll()
    .then((clients) => {
      clients.forEach((client) => {
        client.postMessage({
          type: 'SYNC_COMPLETE',
          data: 'Background sync completed'
        });
      });
    });
}

// Push notification support
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New content available',
    icon: '/assets/images/logo-moowoor.svg',
    badge: '/assets/images/logo-moowoor.svg',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Updates',
        icon: '/assets/images/logo-moowoor.svg'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/assets/images/logo-moowoor.svg'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Moowoor Documentation', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  } else if (event.action === 'close') {
    // Just close the notification
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Periodic background sync (supported browsers only)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'content-update') {
    console.log('[SW] Periodic sync for content updates');
    event.waitUntil(updateContent());
  }
});

// Update content in background
function updateContent() {
  return caches.open(CACHE_NAME)
    .then((cache) => {
      // Add fresh versions of key resources
      return cache.addAll([
        '/data/modules.json',
        '/data/careers.json',
        '/data/governance.json'
      ]);
    });
}

// Handle cache cleanup on message from main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CACHE_UPDATE') {
    console.log('[SW] Manual cache update requested');
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then((cache) => {
          return cache.addAll(urlsToCache);
        })
    );
  }
});