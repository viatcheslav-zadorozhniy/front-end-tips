const worker = new Worker('/scripts/workers/worker.mjs', { type: 'module' });

// Stop the Worker from outside.
// worker.terminate();

let coordinates;
let messageDate;

// Listen to messages from the Worker.
worker.addEventListener('message', event => {
  console.log('Window received:', event.data);
  console.log('Coordinate objects are equal:', event.data.coordinates === coordinates);
  console.log('Message date objects are equal:', event.data.messageDate === messageDate);
});

document.getElementById('post-message-to-worker').addEventListener('click', event => {
  messageDate = new Date();

  coordinates = {
    x: event.clientX,
    y: event.clientY,
  };

  const message = { messageDate, coordinates };
  message.self = message; // Circular references will also be serialized.

  /*
   * Window.postMessage() - https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage
   * The data is serialized using the structured clone algorithm.
   * https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm
   */
  worker.postMessage(message);
});
