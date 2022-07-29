import {
  enableNavigationPreload,
  handleRequest,
  preCacheResources,
  STRATEGIES,
} from './scripts/common/service-worker-utils.mjs'

/*
 * Documentation:
 * https://github.com/GoogleChrome/workbox/
 * https://web.dev/service-worker-lifecycle/
 * https://developer.chrome.com/docs/workbox/
 * https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
 */

const CACHE_NAMES = {
  Documents: 'documents',
  Scripts: 'scripts',
  Styles: 'styles',
};

// The event is fired when a ServiceWorkerRegistration acquires a new ServiceWorkerRegistration.installing worker.
// https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/install_event
self.addEventListener('install', () => {
  /*
   * skipWaiting() prevents the waiting, meaning the service worker activates as soon as it's finished installing.
   * https://web.dev/service-worker-lifecycle/#updates
   * https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/skipWaiting
   */
  self.skipWaiting();

  preCacheResources([
    '/page2/',
    '/page3/',
  ], CACHE_NAMES.Documents);

  console.log('Service Worker: installed.');
});

// https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/activate_event
self.addEventListener('activate', event => {
  event.waitUntil(enableNavigationPreload());

  console.log('Service Worker: activated.');
});

/*
 * Documentation:
 * https://developer.mozilla.org/en-US/docs/Web/API/FetchEvent
 * https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/fetch_event
 */
self.addEventListener('fetch', event => {
  const strategyOptions = {
    request: event.request,
    preloadResponsePromise: event.preloadResponse,
  };

  let strategy;

  // https://developer.mozilla.org/en-US/docs/Web/API/Request/destination
  switch (event.request.destination) {
    case 'document': {
      strategy = STRATEGIES.StaleWhileRevalidate;
      strategyOptions.cacheName = CACHE_NAMES.Documents;
      break;
    }
    case 'worker':
    case 'script': {
      strategy = STRATEGIES.NetworkFirst;
      strategyOptions.cacheName = CACHE_NAMES.Scripts;
      break;
    }
    case 'style': {
      strategy = STRATEGIES.CacheFirst;
      strategyOptions.cacheName = CACHE_NAMES.Styles;
      break;
    }
    default: {}
  }

  if (strategy) {
    event.respondWith(
      handleRequest(strategy, strategyOptions)
    );
  }
});
