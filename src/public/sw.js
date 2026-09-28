const CACHE_NAME = 'dicostory-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.png',
  '/manifest.json',
  '/images/icons/icon-192x192.png',
  '/images/icons/icon-512x512.png',
  '/images/icons/icon-maskable.png',
];

// 1. Install Event: Cache App Shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// 2. Activate Event: Clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch Event: Smart Caching
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Jangan cache POST / PUT / DELETE
  if (request.method !== 'GET') {
    return;
  }

  // A. Story API Requests: Network First, fallback to Cache
  if (url.origin === 'https://story-api.dicoding.dev') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(async () => {
          const cachedResponse = await caches.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }
          // Kembalikan JSON kosong jika offline dan belum tercache
          return new Response(JSON.stringify({ error: false, message: 'Offline Mode: Data diambil dari cache', listStory: [] }), {
            headers: { 'Content-Type': 'application/json' },
          });
        })
    );
    return;
  }

  // B. Map Tiles & External Assets: Stale-While-Revalidate
  if (url.hostname.includes('tile.openstreetmap.org') || url.hostname.includes('cartocdn.com') || url.hostname.includes('fonts.gstatic.com')) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse.ok) {
              const clone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);
        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // C. App Shell & Static Assets: Stale-While-Revalidate with SPA Fallback
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse.ok) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        })
        .catch(() => {
          // Jika navigasi HTML gagal (offline), kembalikan index.html
          if (request.mode === 'navigate' || request.destination === 'document') {
            return caches.match('/index.html') || caches.match('/');
          }
          return cachedResponse;
        });

      return cachedResponse || fetchPromise;
    })
  );
});

// 4. Push Event: Push Notification Handler (Kriteria 2 Wajib & Advance)
self.addEventListener('push', (event) => {
  let payload = {};
  if (event.data) {
    try {
      payload = event.data.json();
    } catch (err) {
      payload = { body: event.data.text() };
    }
  }

  const title = payload.title || 'DicoStory: Cerita Baru!';
  const body = payload.options?.body || payload.body || payload.message || 'Ada cerita baru yang dibagikan di sekitar Anda.';
  const icon = payload.options?.icon || payload.icon || '/images/icons/icon-192x192.png';
  const badge = payload.options?.badge || payload.badge || '/images/icons/icon-72x72.png';

  // Deteksi target URL / story ID dari payload Dicoding Story API
  let storyId = payload.data?.id || payload.id || payload.storyId || payload.data?.storyId;
  let targetUrl = payload.options?.data?.url || payload.data?.url || (storyId ? `/#/detail/${storyId}` : '/#/');

  const options = {
    body,
    icon,
    badge,
    data: {
      url: targetUrl,
      id: storyId,
    },
    // Kriteria 2 (Advance): Menambahkan action untuk navigasi menuju halaman detail data terkait
    actions: [
      {
        action: 'detail-action',
        title: 'Lihat Detail Cerita',
        icon: '/images/icons/icon-72x72.png',
      },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// 5. Notification Click Handler (Kriteria 2 Advance - Navigasi ke Detail Data Terkait)
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  let targetUrl = event.notification.data?.url;
  const storyId = event.notification.data?.id;

  if (storyId) {
    targetUrl = `/#/detail/${storyId}`;
  } else if (!targetUrl) {
    targetUrl = '/#/';
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url && 'focus' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

// 6. Background Sync Handler (Kriteria 4 Advance)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-stories') {
    event.waitUntil(
      clients.matchAll().then((clientList) => {
        clientList.forEach((client) => {
          client.postMessage({ type: 'SYNC_STORIES' });
        });
      })
    );
  }
});
