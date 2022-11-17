import React from 'react';
import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container';
import useAuth from '../hooks/useAuth';

const SimpleLoading = ({ children }) => {
  const { authed } = useAuth();

  if (authed == null) {
    return (
      <Container
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100vh',
        }}
      >
        <Spinner animation="border" variant="warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (!children) console.warn('no children for show on loaded');
  return children;
};

export default SimpleLoading;
