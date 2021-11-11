import React from 'react';
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import MyNav, { BottomNav } from './components/MyNav';
import Home from './pages/Home';
import LinkLister from './pages/LinkLister';
import DirveLister from './pages/DirveLister';
import Login from './pages/Login';
import UploadHtml from './pages/UploadHtml';
import NoSuchPage from './pages/NoSuchPage';
import { AuthProvider } from './hooks/useAuth';

import './styles.css';

const AppRoutes = () => {
  return (
    <Router>
      <MyNav />
      <BottomNav />
      <Switch>
        <Route exact path={['/', '/home']}>
          <Home />
        </Route>
        <Route path="/link-lister">
          <LinkLister />
        </Route>
        <PrivateRoute path="/drive-lister">
          <DirveLister />
        </PrivateRoute>
        <Route path="/login">
          <Login />
        </Route>
        <PrivateRoute path="/upload-html">
          <UploadHtml />
        </PrivateRoute>
        <Route>
          <NoSuchPage />
        </Route>
      </Switch>
    </Router>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;
