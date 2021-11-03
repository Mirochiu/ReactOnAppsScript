import React from 'react';
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import MyNav from './MyNav';
import Home from './Home';
import DirveLister from './DirveLister';
import Login from './Login';
import NoSuchPage from './NoSuchPage';

import '../styles.css';

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
