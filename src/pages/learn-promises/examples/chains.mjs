export default function chains() {
  new Promise(resolve => resolve(2))
    .then(x => x * 2) // returns 4
    .then(x => Promise.resolve(x * 2)) // returns 8
    .then(x => console.log(x))
  ;
};
