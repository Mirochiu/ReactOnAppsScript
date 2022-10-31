import React from 'react';
import Spinner from 'react-bootstrap/Spinner';
import useAuth from '../hooks/useAuth';

const SimpleLoading = ({ children }) => {
  const { authed } = useAuth();

  if (authed == null) {
    return (
      <Spinner animation="border" variant="warning" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  }

  if (!children) console.warn('no children for show on loaded');
  return children;
};

export default SimpleLoading;
