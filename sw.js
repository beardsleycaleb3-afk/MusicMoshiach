const CACHE_NAME = 'MusicMoshiach-v27';

const playlist = ["9.mp3","10.mp3","11.mp3","12.mp3","13.mp3","14.mp3","15.mp3","16.mp3","17.mp3","18.mp3","19.mp3","20.mp3","21.mp3","22.mp3","23.mp3","24.mp3","25.mp3","26.mp3","27.mp3","28.mp3","29.mp3","30.mp3","31.mp3","32.mp3","33.mp3","34.mp3","35.mp3","38.mp3","39.mp3","40.mp3","41.mp3","42.mp3","43.mp3","44.mp3","45.mp3","46.mp3","47.mp3","48.mp3","49.mp3","50.mp3","51.mp3","52.mp3","53.mp3","55.mp3","56.mp3","57.mp3","58.mp3","59.mp3","60.mp3","1.mp3","2.mp3","3.mp3","4.mp3","5.mp3","6.mp3","7.mp3","8.mp3"];

const bgs = ["1.jpg","2.jpg","3.jpg","4.jpg","5.jpg","6.jpg","7.jpg","8.jpg","9.jpg","10.jpg","11.jpg","12.jpg","13.jpg","14.jpg","15.jpg","16.jpg","17.jpg","18.jpg","19.jpg","20.jpg","21.jpg","22.jpg","23.jpg","24.jpg","25.jpg","26.jpg","27.jpg","28.jpg","29.jpg","30.jpg","31.jpg","32.jpg","33.jpg","34.jpg","35.jpg","36.jpg","37.jpg","38.jpg","40.jpg","41.jpg","42.jpg","43.jpg","44.jpg","45.jpg","46.jpg","47.jpg","48.jpg","49.jpg","50.jpg","51.jpg","52.jpg","54.jpg","55.jpg","56.jpg","57.jpg","59.jpg","60.jpg","61.jpg","62.jpg","63.jpg","64.jpg","65.jpg"];

const coreFiles = ["a.jpeg","aa.jpeg","aaa.jpeg","b.jpeg","bb.jpeg","bbb.jpeg","c.jpeg","cc.jpeg","ccc.jpeg","d.jpeg","dd.jpeg","ddd.jpeg","e.jpeg","ee.jpeg","eee.jpeg","f.jpeg","ff.jpeg","fff.jpeg","g.jpeg","gg.jpeg","ggg.jpeg","h.jpeg","hh.jpeg","i.jpeg","ii.jpeg","iii.jpeg","j.jpeg","jj.jpeg","jjj.jpeg","k.jpeg","kk.jpeg","kkk.jpeg","l.jpeg","ll.jpeg","lll.jpeg","m.jpeg","mm.jpeg","mmm.jpeg","n.jpeg","nn.jpeg","o.jpeg","oo.jpeg","p.jpeg","pp.jpeg","q.jpeg","qq.jpeg","r.jpeg","rr.jpeg","s.jpeg","ss.jpeg","t.jpeg","tt.jpeg","u.jpeg","uu.jpeg","v.jpeg","vv.jpeg","w.jpeg","x.jpeg","xx.jpeg","y.jpeg","yy.jpeg","z.jpeg","zz.jpeg"];

const urlsToCache = [
  './',
  'index.html',
  'manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.min.js',
  ...playlist.map(file => `assets/audio/${file}`),
  ...bgs.map(file => `assets/audio/bg/${file}`),
  ...coreFiles.map(file => `assets/audio/core/${file}`)
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

