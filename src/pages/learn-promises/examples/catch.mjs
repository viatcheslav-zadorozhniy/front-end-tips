export default function catchFn() {
  new Promise((resolve, reject) => reject('reject promise'))
    .catch(e => console.log(e));

  new Promise(() => {
    throw new Error('throw an error from promise');
  }).catch(e => console.log(e));

  new Promise(resolve => resolve(2))
    .then(x => x * 2)
    .then(() => Promise.reject('reject from promise chain'))
    .catch(e => console.log(e))
    .then(() => console.log('will never be reached'))
  ;

  new Promise(resolve => resolve(2))
    .then(() => Promise.reject('reject from promise chain'))
    .catch(() => 2) // Catch an error and continue the chain.
    .then(x => x * 2)
    .then(x => console.log(x))
  ;
};
