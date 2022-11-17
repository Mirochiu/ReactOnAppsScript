import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

const LoadingState = ({ done, children, ...rest }) => {
  if (!done) {
    return <Spinner animation="border" role="status" {...rest} />;
  }
  return children;
};

export default LoadingState;
