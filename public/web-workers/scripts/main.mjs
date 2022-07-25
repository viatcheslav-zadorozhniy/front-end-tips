import { EVENTS } from './events.mjs';
import { throttle } from './utils.mjs';

// #region Worker
const worker = new Worker('/scripts/workers/worker.mjs', { type: 'module' });

let coordinates;
let messageDate;

// Stop the worker from outside.
// worker.terminate();

worker.addEventListener('message', event => {
  console.log('Window received:', event.data);
  console.log('Coordinate objects are equal:', event.data.coordinates === coordinates);
  console.log('Message date objects are equal:', event.data.messageDate === messageDate);
});

document.getElementById('to-worker').addEventListener('click', event => {
  messageDate = new Date();

  coordinates = {
    x: event.clientX,
    y: event.clientY,
  };

  // "structuredClone" method is used to clone the data for the worker.
  // The method support - https://caniuse.com/mdn-api_structuredclone
  worker.postMessage({ messageDate, coordinates });
});
// #endregion

// #region SharedWorker
const sharedWorker = new SharedWorker(
  '/scripts/workers/shared-worker.mjs',
  { type: 'module', name: 'Users worker' },
);

sharedWorker.port.start();

const userIdControl = document.getElementById('userId');

const throttlePostMessage = throttle(message => {
  sharedWorker.port.postMessage(message);
}, 400);

sharedWorker.port.addEventListener('message', event => {
  const type = event.data?.type;

  switch (type) {
    case EVENTS.USER_CHANGE: {
      const userId = `${event.data.user.id}`;

      // Sync user id controls for all tabs.
      if (userIdControl.value !== userId) {
        userIdControl.value = event.data.user.id;
      }

      document.getElementById('user-data').innerHTML = JSON.stringify(event.data.user, undefined, 2);
      break;
    }
  }
});

userIdControl.addEventListener('input', event => {
  let userId = parseInt(event.target.value, 10);

  // Lead the value to the range of 1-10.
  // It is supported range of user ids by the JSONPlaceholder API.
  if (isNaN(userId) || userId < 1) {
    event.target.value = userId = 1;
  } else if (userId > 10) {
    event.target.value = userId = 10;
  }

  throttlePostMessage({ userId, type: EVENTS.USER_CHANGE });
});

window.addEventListener('beforeunload', () => {
  sharedWorker.port.postMessage({ type: EVENTS.PAGE_UNLOAD });
})
// #endregion

// #region ServiceWorker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.mjs', {
    type: 'module',
    // Control all content under the specified app's origin.
    // The default scope is equal to the service-worker file folder and can't be higher.
    // scope: '/dashboard/',
  }).then(registration => {
    console.log('Service Worker registered successfully', registration);
  }).catch(error => {
    console.log('Service Worker registration failed: ', error);
  });
}
// #endregion
