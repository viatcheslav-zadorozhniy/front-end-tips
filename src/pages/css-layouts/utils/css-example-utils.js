function buildExampleFooter(exampleCss) {
  const exampleFooter = document.createElement('footer');
  const cssFuncRegExp = /^[a-z-]+\(/i;
  const canIUseLinks = [];
  const mdnLinks = [];

  exampleCss
    .filter((val, i, arr) => { // Filter repeated css statements.
      const prop = val.split(':')[0].trim();

      return arr.indexOf(val) === i
        && arr.findIndex(x => x.startsWith(prop)) === i;
    })
    .forEach(cssStatement => {
      const cssDeclaration = cssStatement
        .split(':')
        .map(x => x.trim().replace(';', ''));

      let cssProp = cssDeclaration[0];

      if (cssFuncRegExp.test(cssDeclaration[1])) {
        cssProp = `${cssFuncRegExp.exec(cssDeclaration[1])[0]})`;
      }

      let canIUseLink = `https://caniuse.com/?search=${cssProp}`;
      let mdnLink = `https://developer.mozilla.org/en-US/docs/Web/CSS/${cssProp}`;

      if (cssDeclaration[0] === 'display' && cssDeclaration[1] === 'grid') {
        cssProp = cssDeclaration.join(': ');
        canIUseLink = 'https://caniuse.com/mdn-css_properties_display_grid';
        mdnLink = 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout';
      }

      canIUseLinks.push(`<li><a href='${canIUseLink}' target='_blank' rel='noopener'>${cssProp}</a></li>`);
      mdnLinks.push(`<li><a href='${mdnLink}' target='_blank' rel='noopener'>${cssProp}</a></li>`);
    });

  exampleFooter.innerHTML = `
    <div>
      <div><b>Browser compatibility:</b></div>
      <ul>${canIUseLinks.join('\n')}</ul>
    </div>

    <div>
      <div><b>MDN:</b></div>
      <ul>${mdnLinks.join('\n')}</ul>
    </div>
  `;

  exampleFooter.classList.add('useful-links');
  return exampleFooter;
}

export function injectFooterToExample(exampleHtml) {
  const exampleWrapper = document.createElement('div');
  const exampleCss = [];

  exampleWrapper.innerHTML = exampleHtml;

  exampleWrapper.querySelectorAll('code').forEach(codeElement => {
    exampleCss.push(...codeElement.innerHTML
      .trim()
      .split('\n')
      .filter(x => x.includes(':'))
      .map(x => x.trim())
    );
  });

  if (exampleCss.length) {
    exampleWrapper.insertAdjacentElement('beforeend', buildExampleFooter(exampleCss));
  }

  return exampleWrapper.innerHTML;
}

export function injectCodeElementsToExample(exampleHtml) {
  const exampleWrapper = document.createElement('div');
  const exampleClassRegExp = /example-\d+/i;

  exampleWrapper.innerHTML = exampleHtml;

  const exampleStyles = exampleWrapper.querySelector('style');

  if (exampleStyles) {
    exampleWrapper.querySelectorAll('[class*="example-"]').forEach(element => {
      const exampleCssClass = exampleClassRegExp.exec(element.className)[0];

      if (exampleCssClass) {
        const regExp = new RegExp(`.${exampleCssClass}\\s?{[^\\}]*\\}`, 'mi');
        const styles = regExp.exec(exampleStyles.textContent);
        const exampleRootElement = element.closest('.example');

        if (styles && !exampleRootElement.querySelector('code')) {
          const codeElement = document.createElement('code');

          codeElement.innerHTML = styles[0]
            .replace(new RegExp(`.${exampleCssClass}\\s?{`), '')
            .replace('}', '');

          // Append code element when it is not empty.
          if (codeElement.innerHTML.trim()) {
            exampleRootElement.insertAdjacentElement('afterbegin', codeElement);
          }
        }
      }
    });
  }

  return exampleWrapper.innerHTML;
}
