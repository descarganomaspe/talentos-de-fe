var CACHE = 'app-v2';
// Red primero: si hay internet siempre se ve la version mas nueva;
// si no hay, se sirve la copia guardada. Al reves (cache primero) la app
// se queda pegada en una version vieja para siempre.
self.addEventListener('install', function(e){ self.skipWaiting(); });
self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.map(function(k){ if (k !== CACHE) return caches.delete(k); }));
  }));
  self.clients.claim();
});
self.addEventListener('fetch', function(e){
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(function(resp){
      var copia = resp.clone();
      caches.open(CACHE).then(function(c){ try { c.put(e.request, copia); } catch(err){} });
      return resp;
    }).catch(function(){ return caches.match(e.request); })
  );
});
var CACHE = 'app-v1';
self.addEventListener('install', function(e){ self.skipWaiting(); });
self.addEventListener('activate', function(e){ self.clients.claim(); });
self.addEventListener('fetch', function(e){
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.open(CACHE).then(function(c){
      return c.match(e.request).then(function(r){
        var red = fetch(e.request).then(function(resp){
          try { c.put(e.request, resp.clone()); } catch(err){}
          return resp;
        }).catch(function(){ return r; });
        return r || red;
      });
    })
  );
});

