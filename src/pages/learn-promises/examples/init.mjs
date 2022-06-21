export default function init() {
  new Promise(resolve => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
};
