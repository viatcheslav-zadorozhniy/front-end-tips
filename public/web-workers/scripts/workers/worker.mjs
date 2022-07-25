import { foo } from '../foo-module.mjs';

console.log('Worker: is initialized', foo);

// Stop the worker from inside.
// self.close();

self.addEventListener('message', event => {
  console.log('Worker received:', { ...event.data });
  event.data.responseDate = new Date();
  postMessage(event.data);
});
