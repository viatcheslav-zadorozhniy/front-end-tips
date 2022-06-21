import CollapsibleList from '../../../common/collapsible-list';
import cssLayoutsMenu from './css-layouts-menu';

export default function CssLayoutsMenu(props) {
  const menuItems = cssLayoutsMenu.map(menuItem => (
    <li key={menuItem.title}>
      <CollapsibleList
        title={menuItem.title}
        items={menuItem.items}
        onItemClick={props.onItemClick}
      />
    </li>
  ));

  return (
    <ul>{menuItems}</ul>
  );
}
