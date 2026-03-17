const CACHE_NAME = 'musicmoshiach-v10';
const urlsToCache = [
  '/',
  'index.html',
  'manifest.json',
  'sw.js',
  'icon-192.png',
  'icon-icon.png',
  'icon-512.png',
  // === ALL 17 HARD-CODED SONGS ===
  'assets/audio/1.mp3','assets/audio/2.mp3','assets/audio/3.mp3','assets/audio/4.mp3',
  'assets/audio/5.mp3','assets/audio/6.mp3','assets/audio/7.mp3','assets/audio/8.mp3',
  'assets/audio/9.mp3','assets/audio/10.mp3','assets/audio/11.mp3','assets/audio/12.mp3',
  'assets/audio/13.mp3','assets/audio/14.mp3','assets/audio/15.mp3','assets/audio/16.mp3',
  'assets/audio/17.mp3',
  // === ALL BACKGROUND IMAGES ===
  'assets/audio/bg/1.jpg','assets/audio/bg/10.jpg','assets/audio/bg/11.jpg','assets/audio/bg/12.jpg',
  'assets/audio/bg/13.jpg','assets/audio/bg/14.jpg','assets/audio/bg/15.jpg','assets/audio/bg/16.jpg',
  'assets/audio/bg/17.jpg','assets/audio/bg/18.jpg','assets/audio/bg/19.jpg','assets/audio/bg/20.jpg',
  'assets/audio/bg/21.jpg','assets/audio/bg/22.jpg','assets/audio/bg/24.jpg','assets/audio/bg/25.jpg',
  'assets/audio/bg/26.jpg','assets/audio/bg/27.jpg','assets/audio/bg/28.jpg','assets/audio/bg/29.jpg',
  'assets/audio/bg/35.jpg','assets/audio/bg/36.jpg','assets/audio/bg/37.jpg','assets/audio/bg/47.jpg',
  'assets/audio/bg/51.jpg','assets/audio/bg/52.jpg','assets/audio/bg/53.jpg','assets/audio/bg/54.jpg',
  'assets/audio/bg/56.jpg','assets/audio/bg/57.jpg','assets/audio/bg/58.jpg','assets/audio/bg/59.jpg',
  'assets/audio/bg/60.jpg','assets/audio/bg/61.jpg','assets/audio/bg/62.jpg','assets/audio/bg/63.jpg',
  'assets/audio/bg/70.jpg',
  // === ALL CORE TEXTURES ===
  'assets/audio/core/c.jpeg','assets/audio/core/d.jpeg','assets/audio/core/e.jpeg','assets/audio/core/f.jpeg',
  'assets/audio/core/g.jpeg','assets/audio/core/h.jpeg','assets/audio/core/i.jpeg','assets/audio/core/j.jpeg',
  'assets/audio/core/k.jpeg','assets/audio/core/l.jpeg','assets/audio/core/m.jpeg','assets/audio/core/n.jpeg',
  'assets/audio/core/o.jpeg','assets/audio/core/p.jpeg','assets/audio/core/q.jpeg','assets/audio/core/r.jpeg',
  'assets/audio/core/s.jpeg','assets/audio/core/t.jpeg','assets/audio/core/u.jpeg','assets/audio/core/v.jpeg',
  'assets/audio/core/w.jpeg','assets/audio/core/x.jpeg','assets/audio/core/y.jpeg','assets/audio/core/z.jpeg',
  'assets/audio/core/aa.jpeg','assets/audio/core/bb.jpeg','assets/audio/core/cc.jpeg','assets/audio/core/ii.jpeg',
  'assets/audio/core/jj.jpeg','assets/audio/core/kk.jpeg','assets/audio/core/ll.jpeg','assets/audio/core/mm.jpeg',
  'assets/audio/core/nn.jpeg','assets/audio/core/oo.jpeg','assets/audio/core/2i.jpeg','assets/audio/core/2k.jpeg'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('🧡 MusicMoshiach v7 caching everything...');
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE_NAME ? caches.delete(k) : null))));
  console.log('🚀 MusicMoshiach v7 ready — install prompt works perfectly');
});
