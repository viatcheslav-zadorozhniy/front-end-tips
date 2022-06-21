import { lazy, Suspense } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import MainNav from './common/main-nav/MainNav';

const Home = lazy(() => import('./pages/home/Home'));
const LearnPromises = lazy(() => import('./pages/learn-promises/LearnPromises'));
const CssLayouts = lazy(() => import('./pages/css-layouts/CssLayouts'));

export default function App() {
  return (
    <Router>
      <header>
        <MainNav />
      </header>
      <main>
        <Suspense fallback={<div>Loading...</div>}>
          <Switch>
            <Route path='/css/layouts' component={CssLayouts}/>
            <Route path='/js/promises' component={LearnPromises}/>
            <Route exact path='/' component={Home}/>
          </Switch>
          </Suspense>
      </main>
    </Router>
  );
}
