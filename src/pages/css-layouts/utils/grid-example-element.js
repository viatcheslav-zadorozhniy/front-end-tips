const defaultChildrenAmount = 7;

const gridChildrenContentMap = {
  1: 'One',
  2: 'Two',
  3: 'Three',
  4: 'Four',
  5: 'Five',
  6: 'Six',
  7: 'Seven',
};

export default class GridExampleElement extends HTMLDivElement {
  constructor() {
    super();

    // Create example content.
    const exampleContent = document.createDocumentFragment();
    const childrenAmount = +(this.dataset.childrenAmount || defaultChildrenAmount);
    let startChildIndex = 1;

    if (this.childElementCount) {
      startChildIndex = this.childElementCount + 1;
    }

    for (let i = startChildIndex; i <= childrenAmount; i++) {
      const div = document.createElement('div');
      const defaultChildContent = gridChildrenContentMap[i] || i;

      div.innerHTML = this.dataset[`children${i}Content`] || defaultChildContent;
      exampleContent.appendChild(div);
    }

    // Append content to the element.
    this.appendChild(exampleContent);
  }
}
