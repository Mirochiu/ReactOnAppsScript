import React from 'react';
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import MyNav from './components/MyNav';
import Home from './pages/Home';
import DirveLister from './pages/DirveLister';
import Login from './pages/Login';
import NoSuchPage from './pages/NoSuchPage';

import './styles.css';

const App = () => {
  return (
    <Router>
      <MyNav />
      <Switch>
        <Route exact path={['/', '/home']}>
          <Home />
        </Route>
        <Route path="/drive-lister">
          <DirveLister />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route>
          <NoSuchPage />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
