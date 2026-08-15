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

