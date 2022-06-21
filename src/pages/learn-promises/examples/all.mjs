export default function all() {
  const promise1 = new Promise(resolve => setTimeout(() => resolve('first'), 1000));
  const promise2 = new Promise(resolve => setTimeout(() => resolve('second'), 2000));
  const promise3 = new Promise(resolve => setTimeout(() => resolve('third')));

  Promise.all([
    promise1,
    promise2,
    promise3
  ]).then(results => {
    console.log(results);
  });

  Promise.all([
    promise1,
    promise2,
    promise3,
    Promise.reject('then callback will not be executed')
  ]).then(results => {
    console.log(results);
  }).catch(e => console.log(e));
};
