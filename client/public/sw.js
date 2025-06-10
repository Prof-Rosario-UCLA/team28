const CACHE_NAME = 'v1';
const ASSETS = [
  '/', 
  '/index.html',
  '/assets/favicon.ico',   // replace with your actual bundle names
  '/assets/index.js',
  '/assets/index.css', 
  '/icon192.png',
  '/icon512.png',
  '/defaultProfile.jpg'
];

self.addEventListener('install', e =>
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)))
);

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      )
    )
  );
});

self.addEventListener('fetch', e => {
  // Skip API calls and let them go directly to network
  if (e.request.url.includes('/api/')) {
    return;
  }
  
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});