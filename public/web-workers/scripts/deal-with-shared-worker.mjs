import { EVENTS } from './common/events.mjs';
import { throttle } from './common/utils.mjs';

const sharedWorker = new SharedWorker(
  '/scripts/workers/shared-worker.mjs',
  { type: 'module', name: 'User worker' },
);

// Begins dispatching messages received on the port.
sharedWorker.port.start();

// Notify a Shared Worker about page unload.
// It can be used to remove the page from the message recipients list.
window.addEventListener('beforeunload', () => {
  sharedWorker.port.postMessage({ type: EVENTS.PageUnload });
});

const userIdControl = document.getElementById('user-id');
const userDataElement = document.getElementById('user-data');

// Listen to the messages from the Shared Worker.
sharedWorker.port.addEventListener('message', event => {
  const type = event.data?.type;

  switch (type) {
    case EVENTS.UserChange: {
      // Sync user id controls for all tabs.
      if (userIdControl.valueAsNumber !== event.data.user.id) {
        userIdControl.value = event.data.user.id;
      }

      userDataElement.innerHTML = JSON.stringify(event.data.user, undefined, 2);
      break;
    }
    case EVENTS.UserReset: {
      userIdControl.value = '';
      userDataElement.innerHTML = '';
      break;
    }
    default: {}
  }
});

const throttlePostMessage = throttle(message => {
  sharedWorker.port.postMessage(message);
}, 400);

userIdControl.addEventListener('input', event => {
  let userId = event.target.valueAsNumber;

  // Clear the value when it is not a number.
  if (isNaN(userId)) {
    event.target.value = '';
    throttlePostMessage({ type: EVENTS.UserReset });
    return;
  }

  // Lead the value to the range of 1-10.
  // It is supported range of user ids by the JSONPlaceholder API.
  if (userId < 1) {
    event.target.value = userId = 1;
  } else if (userId > 10) {
    event.target.value = userId = 10;
  }

  throttlePostMessage({ userId, type: EVENTS.UserChange });
});
