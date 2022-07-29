console.log('Worker: initialized.');

// Stop the Worker from inside.
// self.close();

// Listen to messages sent to the Worker.
self.addEventListener('message', event => {
  console.log('Worker: received', { ...event.data });

  event.data.responseDate = new Date();

  /*
   * Worker.postMessage() - https://developer.mozilla.org/en-US/docs/Web/API/Worker/postMessage
   * The data is serialized using the structured clone algorithm.
   * https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm
   */
  self.postMessage(event.data);
});
