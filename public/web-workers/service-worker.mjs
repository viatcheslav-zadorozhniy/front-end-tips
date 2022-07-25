const cacheName = 'cache-v1';

const addResourcesToCache = async (resources) => {
  const cache = await caches.open(cacheName);
  await cache.addAll(resources);
  console.log('addAll');
};

const putInCache = async (request, response) => {
  const cache = await caches.open(cacheName);
  await cache.put(request, response);
};

const cacheFirst = async ({ request, preloadResponsePromise, fallbackUrl }) => {
  // First try to get the resource from the cache.
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }

  // Next try to use the preloaded response, if it's there.
  const preloadResponse = await preloadResponsePromise;
  if (preloadResponse) {
    console.info('using preload response', preloadResponse);
    putInCache(request, preloadResponse.clone());
    return preloadResponse;
  }

  // Next try to get the resource from the network.
  try {
    const responseFromNetwork = await fetch(request);
    // Response may be used only once.
    // We need to save clone to put one copy in cache and serve second one.
    putInCache(request, responseFromNetwork.clone());
    return responseFromNetwork;
  } catch (error) {
    const fallbackResponse = await caches.match(fallbackUrl);
    if (fallbackResponse) {
      return fallbackResponse;
    }
    // When even the fallback response is not available,
    // there is nothing we can do, but we must always
    // return a Response object.
    return new Response('Network error happened', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
};

const enableNavigationPreload = async () => {
  // https://developer.mozilla.org/en-US/docs/Web/API/NavigationPreloadManager/enable
  // https://web.dev/navigation-preload/
  if (self.registration.navigationPreload) {
    // Enable navigation preloads!
    await self.registration.navigationPreload.enable();
  }
};

self.addEventListener('activate', event => {
  console.log('activate');
  // event.waitUntil(clients.claim());
  event.waitUntil(enableNavigationPreload());
});

self.addEventListener('install', (event) => {
  // The promise that skipWaiting() returns can be safely ignored.
  // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/skipWaiting
  self.skipWaiting();

  console.log('install');
  addResourcesToCache([
    '/page2/',
    '/page3/',
  ]);
  // event.waitUntil();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    cacheFirst({
      request: event.request,
      preloadResponsePromise: event.preloadResponse,
      fallbackUrl: '/sw-test/gallery/myLittleVader.jpg',
    })
  );
});
