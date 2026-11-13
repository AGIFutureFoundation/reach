"use strict";
/* Reach service worker — app-shell cache only.
   Scope: same-origin GET requests for the app's own static files.
   Strategy: cache-first with a background refresh, so Reach opens
   instantly (and offline) after the first visit while updates still
   land. The cache name is versioned; old caches are dropped on
   activate. Nothing cross-origin is ever intercepted, and no user
   data passes through here — the app keeps that in localStorage. */

const CACHE = "reach-shell-v3";
const SHELL = [
  "./",
  "./index.html",
  "./app.js",
  "./style.css",
  "./manifest.webmanifest",
  "./icon.svg"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET" || url.origin !== self.location.origin) return;
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then(hit => {
      const network = fetch(event.request).then(res => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(cache => cache.put(event.request, copy));
        }
        return res;
      }).catch(() => hit);
      return hit || network;
    })
  );
});
