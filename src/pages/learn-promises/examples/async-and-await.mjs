export default function asyncAndAwait() {
  const getAsyncValue1 = async () => Promise.resolve(1);

  const getAsyncValue2 = async () => {
    return new Promise(resolve => setTimeout(() => resolve(2), 500));
  };

  const getAsyncValue3 = async () => Promise.reject('Oh, no!');

  const asyncFn = async () => {
    const value1 = await getAsyncValue1();
    console.log({ value1 });

    const value2 = await getAsyncValue2();
    console.log({ value2 });

    const value3 = await getAsyncValue3();
    console.log({ value3 });

    return value1 + value2 + value3;
  };

  asyncFn()
    .then(x => console.log(x))
    .catch(e => console.log(e));
};
