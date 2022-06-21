export default function eventLoop() {
  console.log('regular flow start');

  setTimeout(() => console.log('setTimeout before promise'));

  new Promise(resolve => {
    console.log('Promise 1 initiated');
    setTimeout(resolve, 0);
  }).then(() => console.log('promise with setTimeout resolve'));

  new Promise(resolve => {
    console.log('Promise 2 initiated');
    resolve();
  }).then(() => console.log('promise with immediate resolve'));

  setTimeout(() => console.log('setTimeout after promise'));

  console.log('regular flow end');
};
