const CACHE_NAME = 'MusicMoshiach-v26';

const playlist = ["9.mp3","10.mp3","11.mp3","12.mp3","13.mp3","14.mp3","15.mp3","16.mp3","17.mp3","18.mp3","19.mp3","20.mp3","21.mp3","22.mp3","23.mp3","24.mp3","25.mp3","26.mp3","27.mp3","28.mp3","29.mp3","30.mp3","31.mp3","32.mp3","33.mp3","34.mp3","35.mp3","38.mp3","39.mp3","40.mp3","41.mp3","42.mp3","43.mp3","44.mp3","45.mp3","46.mp3","47.mp3","48.mp3","49.mp3","50.mp3","51.mp3","52.mp3","53.mp3","55.mp3","56.mp3","57.mp3","58.mp3","59.mp3","60.mp3","1.mp3","2.mp3","3.mp3","4.mp3","5.mp3","6.mp3","7.mp3","8.mp3"];

const bgs = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,40,41,42,43,44,45,46,47,48,49,50,51,52,54,55,56,57,59,60,61,62,63,64,65];

const coreFiles = ['a','aa','aaa','b','bb','bbb','c','cc','ccc','d','dd','ddd','e','ee','eee','f','ff','fff','g','gg','ggg','h','hh','i','ii','iii','j','jj','jjj','k','kk','kkk','l','ll','lll','m','mm','mmm','n','nn','o','oo','p','pp','q','qq','r','rr','s','ss','t','tt','u','uu','v','vv','w','x','xx','y','yy','z','zz'];

const urlsToCache = [
  './',
  'index.html',
  'manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.min.js',
  ...playlist.map(file => `assets/audio/${file}`),
  ...bgs.map(file => `assets/audio/bg/${file}.jpg`),
  ...coreFiles.map(file => `assets/audio/core/${file}.jpeg`)
];

addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});

addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => Promise.all(
      cacheNames.map(cacheName => cacheWhitelist.includes(cacheName) ? null : caches.delete(cacheName))
    ))
  );
});
