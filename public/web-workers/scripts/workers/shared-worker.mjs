/* Debug via:
 * chrome://inspect/#workers
 * about:debugging#workers
 */

import { EVENTS } from '../events.mjs';

console.log('Shared Worker: is initialized');

const ports = [];

const fetchUser = async userId => {
  const url = `https://jsonplaceholder.typicode.com/users/${userId}`;
  const response = await fetch(url);
  return await response.json();
};

const postMessageForAllPorts = message => {
  console.log(`Ports to be notified: ${ports.length}`);

  ports.forEach(port => {
    port.postMessage(message);
  });
};

self.addEventListener('connect', connectEvent => {
  const port = connectEvent.ports[0];

  ports.push(port);

  console.log('Shared Worker: new connection initialized');

  port.addEventListener('error', error => {
    console.error(error);
  });

  port.addEventListener('message', event => {
    const type = event.data?.type;

    switch (type) {
      case EVENTS.USER_CHANGE: {
        fetchUser(event.data.userId).then(user => postMessageForAllPorts({ user, type }));
        break;
      }
      case EVENTS.PAGE_UNLOAD: {
        // Remove unloaded page from the ports list.
        ports.splice(ports.indexOf(event.target), 1);
        break;
      }
    }
  });

  port.start(); // Required when using addEventListener. Otherwise called implicitly by onmessage setter.
});
