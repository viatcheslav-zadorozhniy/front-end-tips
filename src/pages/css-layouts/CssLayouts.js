import { useEffect, useState } from 'react';
import GridExampleElement from './utils/grid-example-element';
import CssLayoutsMenu from './menu/CssLayoutsMenu';
import { injectCodeElementsToExample, injectFooterToExample } from './utils/css-example-utils';
import fetchHtml from '../../utils/fetch-html';
import './CssLayouts.css';

if (!customElements.get('grid-example')) {
  customElements.define('grid-example', GridExampleElement, { extends: 'div' });
}

export default function CssLayouts(props) {
  const [exampleHtml, setExampleHtml] = useState('');

  function applyExample(locationHash) {
    const exampleName = locationHash.slice(1);

    fetchHtml(`css-examples/${exampleName}`)
      .then(x => injectCodeElementsToExample(x))
      .then(x => injectFooterToExample(x))
      .then(x => setExampleHtml(x));
  }

  function handleItemClick(event) {
    const exampleName = event.target.getAttribute('href');

    if (exampleName === props.location.hash) {
      event.preventDefault();
      return;
    }

    applyExample(exampleName);
  }

  useEffect(() => {
    if (window.location.hash) {
      applyExample(window.location.hash);
    }
  }, []);

  return (
    <article className='css-layouts'>
      <h1>CSS Layouts</h1>
      <nav>
        <CssLayoutsMenu onItemClick={handleItemClick} />
      </nav>
      <article dangerouslySetInnerHTML={{ __html: exampleHtml }}></article>
    </article>
  );
}
