const CACHE_NAME = 'MusicMoshiach-v14';

const urlsToCache = [
  './',
  'index.html',
  'manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.min.js',
  // Map the specific folders to the file arrays
  const playlist = ["9.mp3","10.mp3","11.mp3","12.mp3","13.mp3","14.mp3","15.mp3","16.mp3","17.mp3","1.mp3","2.mp3","3.mp3","4.mp3","5.mp3","6.mp3","7.mp3","8.mp3"];
const bgs = [1,10,11,12,13,14,15,16,17,18,19,20,21,22,24,25,26,27,28,29,35,36,37,47,51,52,53,54,56,57,58,59,60,61,62,63,70];
const coreFiles = ['c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','aa','bb','cc','ii','jj','kk','ll','mm','nn','oo','2i','2k'];

  ...playlist.map(file => `assets/audio/${file}`),
  ...bgs.map(file => `assets/audio/bg/${file}.jpg`),
  ...coreFiles.map(file => `assets/audio/core/${file}.jpeg`)
];

// Install SW and cache all files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Cache-first strategy for performance and offline use
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// Clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
