const putInCache = async (request, response, cacheName) => {
  const cache = await caches.open(cacheName);
  await cache.put(request, response);
};

const createNetworkUnavailableResponse = () => {
  return new Response('Network unavailable', { status: 503 });
};

const createNetworkErrorResponse = () => {
  return new Response('Network error happened', {
    status: 408,
    headers: { 'Content-Type': 'text/plain' },
  });
};

const fetchAndPutToCache = async (request, cacheName) => {
  if (!navigator.onLine) {
    return createNetworkUnavailableResponse();
  }

  try {
    const responseFromNetwork = await fetch(request);
    // Response may be used only once.
    // We need to save clone to put one copy in cache and serve second one.
    putInCache(request, responseFromNetwork.clone(), cacheName);
    return responseFromNetwork;
  } catch {
    // We must always return a Response object.
    return createNetworkErrorResponse();
  }
};

const cacheFirst = async ({ cacheName, preloadResponsePromise, request }) => {
  // First, try to get the resource from the cache.
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }

  // Next, try to use the preloaded response, if it's there.
  const preloadResponse = await preloadResponsePromise;
  if (preloadResponse) {
    // Preload response may be used only once.
    // We need to save clone to put one copy in cache and serve second one.
    putInCache(request, preloadResponse.clone(), cacheName);
    return preloadResponse;
  }

  // Finally, try to get the resource from the network.
  return await fetchAndPutToCache(request, cacheName);
};

const networkFirst = async ({ cacheName, request }) => {
  const responseFromCache = caches.match(request);

  if (!navigator.onLine) {
    return await responseFromCache || createNetworkUnavailableResponse();
  }

  try {
    const responseFromNetwork = await fetch(request);
    // Response may be used only once.
    // We need to save clone to put one copy in cache and serve second one.
    putInCache(request, responseFromNetwork.clone(), cacheName);
    return responseFromNetwork;
  } catch {
    // Try to fall back to the response from the cache otherwise return a network error response.
    return await responseFromCache || createNetworkErrorResponse();
  }
};

const staleWhileRevalidate = async ({ cacheName, request }) => {
  const httpRequest = fetchAndPutToCache(request, cacheName);

  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }

  return await httpRequest;
};

export const enableNavigationPreload = async () => {
  /*
   * The enable() method is used to enable preloading of resources managed by the service worker.
   * https://developer.mozilla.org/en-US/docs/Web/API/NavigationPreloadManager/enable
   * 
   * Speed up service worker with navigation preloads:
   * https://web.dev/navigation-preload/
   */
  if (self.registration.navigationPreload) {
    // Enable navigation preloads!
    await self.registration.navigationPreload.enable();
  }
};

export const preCacheResources = async (resources, cacheName) => {
  const cache = await caches.open(cacheName);
  await cache.addAll(resources);
};

export const STRATEGIES = {
  // Inspired by:
  // https://developer.chrome.com/docs/workbox/modules/workbox-strategies/#cache-first-cache-falling-back-to-network
  CacheFirst: 'CacheFirst',

  // Inspired by:
  // https://developer.chrome.com/docs/workbox/modules/workbox-strategies/#network-first-network-falling-back-to-cache
  NetworkFirst: 'NetworkFirst',

  // Inspired by:
  // https://developer.chrome.com/docs/workbox/modules/workbox-strategies/#stale-while-revalidate
  StaleWhileRevalidate: 'StaleWhileRevalidate',
};

export const handleRequest = async (strategy, strategyOptions) => {
  /*
   * Inspired by:
   * https://developer.chrome.com/docs/workbox/modules/workbox-strategies/
   * https://developer.chrome.com/docs/workbox/reference/workbox-strategies/
   */
  switch (strategy) {
    case STRATEGIES.CacheFirst: {
      return cacheFirst(strategyOptions);
    }
    case STRATEGIES.NetworkFirst: {
      return await networkFirst(strategyOptions);
    }
    case STRATEGIES.StaleWhileRevalidate: {
      return staleWhileRevalidate(strategyOptions);
    }
    default: {
      return await fetchAndPutToCache(strategyOptions.request, strategyOptions.cacheName);
    }
  }
};
