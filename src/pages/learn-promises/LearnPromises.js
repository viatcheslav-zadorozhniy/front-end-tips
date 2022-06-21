import { useState } from 'react';
import './LearnPromises.css';

export default function CssLayouts() {
  const [exampleCode, setExampleCode] = useState('');

  function applyPromiseExample(event) {
    if (event.target.value) {
      import(`./examples/${event.target.value}.mjs`).then(example => {
        // Run example code.
        example.default();

        // Print example code.
        setExampleCode(example.default
          .toString()
          .match(/function[^{]+\{([\s\S]*)\}$/)[1]
          .replace('\r\n', '')
        );
      });
    } else {
      setExampleCode('');
    }
  }

  return (
    <article className='learn-promises'>
      <h1>Promises</h1>

      <div>
        <label>Examples:</label>
        <select onChange={applyPromiseExample} defaultValue=''>
          <option value=''>Select</option>
          <option value='init'>Initializing</option>
          <option value='event-loop'>Event loop</option>
          <option value='chains'>Chains</option>
          <option value='catch'>Catch</option>
          <option value='all'>All</option>
          <option value='all-settled'>All settled</option>
          <option value='finally'>Finally</option>
          <option value='race'>Race</option>
          <option value='async-and-await'>Async and await</option>
        </select>
      </div>

      <code dangerouslySetInnerHTML={{ __html: exampleCode }}></code>
    </article>
  );
}
