export default function allSettled() {
  const promise1 = Promise.resolve('first');
  const promise2 = Promise.reject('second');
  const promise3 = Promise.resolve('third');

  Promise.allSettled([
    promise1,
    promise2,
    promise3
  ]).then(results => {
    results.forEach(x => console.log(x));
  });
};
