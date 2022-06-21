export default function race() {
  const promise1 = new Promise(resolve => setTimeout(() => resolve('first'), 100));
  const promise2 = new Promise(resolve => setTimeout(() => resolve('second'), 200));
  const promise3 = new Promise(resolve => setTimeout(() => resolve('third')));

  Promise.race([
    promise1,
    promise2,
    promise3
  ]).then(result => {
    console.log(result);
  });
};
