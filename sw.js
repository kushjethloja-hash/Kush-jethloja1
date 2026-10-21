const CACHE="kush-app-v2";
const CORE=["./","index.html","chat.html","databank.html","zip.html","manifest.json","icon-v2-192.png","icon-v2-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  const url=new URL(e.request.url);
  if(!/^https?:$/.test(url.protocol))return;
  if(url.hostname.includes("peerjs.com"))return;
  // network first: new uploads show up right away, cache only used offline
  e.respondWith(fetch(e.request).then(r=>{
    if(r&&(r.ok||r.type==="opaque")){const cp=r.clone();caches.open(CACHE).then(c=>c.put(e.request,cp));}
    return r;
  }).catch(()=>caches.match(e.request)));
});
