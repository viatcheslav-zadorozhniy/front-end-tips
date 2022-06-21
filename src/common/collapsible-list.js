import { useEffect, useRef } from 'react';

export default function CollapsibleList(props) {
  const detailsEl = useRef(null);
  let hasActiveItem = false;

  const listItems = props.items.map((item, index) => {
    let itemContent = item.title;

    if (item.href) {
      if (item.href === window.location.hash) {
        hasActiveItem = true;
        itemContent = <a href={item.href} className="active">{item.title}</a>;
      } else {
        itemContent = <a href={item.href} onClick={props.onItemClick}>{item.title}</a>;
      }
    }

    return <li key={item.href || index}>{itemContent}</li>
  });

  useEffect(() => {
    if (hasActiveItem) {
      detailsEl.current.open = true;
    }
  }, [hasActiveItem]);

  return (
    <details ref={detailsEl}>
      <summary>{props.title}</summary>
      <ul>{listItems}</ul>
    </details>
  );
}
