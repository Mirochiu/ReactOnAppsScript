import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import useAuth from '../hooks/useAuth';

const PrivateRoute = ({ children, path }) => {
  const { authed } = useAuth();
  const ele =
    authed === true ? (
      children
    ) : (
      <Redirect
        to={{
          pathname: '/login',
          state: { message: '使用此功能需要先請您登入' },
        }}
      />
    );
  return <Route path={path}>{ele}</Route>;
};

PrivateRoute.propTypes = {
  children: PropTypes.element,
  path: PropTypes.string,
};

export default PrivateRoute;
