const CACHE_NAME = 'MusicMoshiach-v2';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  // Audio 1-17
  ...Array.from({length: 17}, (_, i) => `./assets/audio/${i+1}.mp3`),
  // Backgrounds
  ...[1, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 24, 25, 26, 27, 28, 29, 35, 36, 37, 47, 51, 52, 53, 54, 56, 57, 58, 59, 60, 61, 62, 63, 70].map(n => `./assets/bg/${n}.jpg`),
  // Cores
  ...['c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','aa','bb','cc','ii','jj','kk','ll','mm','nn','oo','2i','2k'].map(l => `./assets/audio/core/${l}.jpeg`)
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});
