const CACHE_NAME = 'MusicMoshiach-v3';
const ASSETS = [
  './', './index.html', './manifest.json',
  ...Array.from({length: 17}, (_, i) => `./assets/audio/${i+1}.mp3`),
  ...[1, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 24, 25, 26, 27, 28, 29, 35, 36, 37, 47, 51, 52, 53, 54, 56, 57, 58, 59, 60, 61, 62, 63, 70].map(n => `./assets/audio/bg/${n}.jpg`),
  ...['c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','aa','bb','cc','ii','jj','kk','ll','mm','nn','oo','2i','2k'].map(l => `./assets/audio/core/${l}.jpeg`)
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
