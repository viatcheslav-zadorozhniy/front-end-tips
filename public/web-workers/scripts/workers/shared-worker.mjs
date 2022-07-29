/* Debug via:
 * Chrome - chrome://inspect/#workers
 * Firefox - about:debugging#workers
 */

import { EVENTS } from '../common/events.mjs';

console.log('Shared Worker: initialized.');

const ports = [];
let currentUser;

const fetchUser = async userId => {
  const url = `https://jsonplaceholder.typicode.com/users/${userId}`;
  const response = await fetch(url);
  return await response.json();
};

const postMessageForAllPorts = message => {
  console.log(`Ports to be notified: ${ports.length}.`);

  /*
   * Worker.postMessage() - https://developer.mozilla.org/en-US/docs/Web/API/Worker/postMessage
   * The data is serialized using the structured clone algorithm.
   * https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm
   */
  ports.forEach(port => {
    port.postMessage(message);
  });
};

// Listen to the new connections to the Shared Worker.
self.addEventListener('connect', connectEvent => {
  const port = connectEvent.ports[0];

  // Add to the list of active ports to notify all at once.
  ports.push(port);

  console.log('Shared Worker: new connection initialized.');

  // Notify the new port about the current state if not empty.
  if (currentUser) {
    port.postMessage({
      user: currentUser,
      type: EVENTS.UserChange,
    });
  }

  // Listen to messages sent to the connected port.
  port.addEventListener('message', event => {
    const type = event.data?.type;

    switch (type) {
      case EVENTS.UserChange: {
        fetchUser(event.data.userId).then(user => {
          currentUser = user;
          postMessageForAllPorts({ user, type });
        });
        break;
      }
      case EVENTS.UserReset: {
        currentUser = undefined;
        postMessageForAllPorts({ type });
        break;
      }
      case EVENTS.PageUnload: {
        // Remove unloaded page from the ports list.
        ports.splice(ports.indexOf(event.target), 1);
        break;
      }
      default: {}
    }
  });

  // Required when using addEventListener. Otherwise called implicitly by onmessage setter.
  port.start();
});
