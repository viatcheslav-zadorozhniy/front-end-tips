(function() {

  // Cache requests with a proxy object if available.
  if (typeof Proxy !== 'undefined') {
    const cache = new Map();

    window.fetch = new Proxy(window.fetch, {
      apply: (target, thisArg, args) => {
        const firstArg = args[0];
        const initOptions = args[1];

        let url = firstArg;
        let method = 'GET';

        if (firstArg instanceof Request) {
          url = firstArg.url;
          method = firstArg.method;
        }

        if (initOptions && initOptions.method) {
          method = initOptions.method;
        }

        const cacheable = method.toUpperCase() === 'GET';

        // Return response from the cache.
        if (cache.has(url) && cacheable) {
          return Promise.resolve(cache.get(url).clone());
        }

        return target
          .apply(thisArg, args)
          .then(response => {
            if (cacheable) {
              cache.set(url, response.clone());
            }
            return response;
          });
      },
    });
  }
}());
