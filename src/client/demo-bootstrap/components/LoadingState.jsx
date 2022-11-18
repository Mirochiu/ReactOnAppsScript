import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

const LoadingState = ({ done, children, then, ...rest }) => {
  if (!done) {
    return <Spinner animation="border" role="status" {...rest} />;
  }
  if (then) {
    return then(done);
  }
  return children;
};

export default LoadingState;
