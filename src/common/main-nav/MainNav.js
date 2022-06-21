import { NavLink } from 'react-router-dom';
import './MainNav.css';

export default function MainNav() {
  return (
    <nav className='main-nav'>
      <ul>
        <li><NavLink exact to='/'>Home</NavLink></li>
        <li>
          <span>CSS</span>
          <ul>
            <li><NavLink to='/css/layouts'>Layouts</NavLink></li>
          </ul>
        </li>
        <li>
          <span>JavaScript</span>
          <ul>
            <li><NavLink to='/js/promises'>Promises</NavLink></li>
          </ul>
        </li>
      </ul>
    </nav>
  );
}
