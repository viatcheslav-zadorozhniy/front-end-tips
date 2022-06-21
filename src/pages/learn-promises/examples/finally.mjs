export default function finallyFn() {
  const promise1 = Promise.resolve();
  const promise2 = Promise.reject();

  promise1
    .then(() => console.log('Promise 1 then'))
    .finally(() => console.log('Promise 1 finally'));

  promise2
    .then(() => console.log('Promise 2 then'))
    .finally(() => console.log('Promise 2 finally'));
};
