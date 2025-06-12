/*const CACHE_NAME = 'v1';
const ASSETS = [
  '/', 
  '/index.html',
  '/assets/favicon.ico',   
  '/assets/index.js',
  '/assets/index.css', 
  '/icon192.png',
  '/icon512.png',
  '/defaultProfile.jpg'
];

//Install: pre-cache your app shell and assets
self.addEventListener('install', e => {
  e.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

//Activate: clean up old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});

//Fetch:  
//   Let API calls go straight to network  
//   For navigation(page loads), serve index.html (fallback)
//   For other assets, try cache first then network
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  //Skip API calls
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  //navigation requests
  if (e.request.mode === 'navigate') {
    e.respondWith(
      caches.match('/index.html').then(cachedShell =>
        cachedShell || fetch('/index.html')
      )
    );
    return;
  }

  // other requests: cache-first
  e.respondWith(
    caches.match(e.request).then(cachedResponse =>
      cachedResponse || fetch(e.request)
    )
  );
});*/
