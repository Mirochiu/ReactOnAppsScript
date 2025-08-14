import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { serverFunctions } from '../../utils/serverFunctions';

const OAuthLoginButton = ({ serverFunction, variant, className, children }) => {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    let mounted = true;
    serverFunction()
      .then((rsp) => mounted && setUrl(rsp))
      .catch((err) => console.debug(err.message));
    return () => {
      mounted = false;
    };
  }, []);

  if (url == null) return undefined;

  return (
    <Button
      variant={variant}
      className={className}
      onClick={() => {
        window.top.location.href = url;
      }}
    >
      {children}
    </Button>
  );
};

export const GoogleLoginButton = ({ children }) => {
  return (
    <OAuthLoginButton
      variant="outline-secondary"
      className="rounded-pill"
      serverFunction={serverFunctions.getGoogleLoginURL}
    >
      {children || 'Google Login'}
    </OAuthLoginButton>
  );
};

export const LineLoginButton = ({ children }) => {
  return (
    <OAuthLoginButton
      variant="success"
      className="rounded-pill"
      serverFunction={serverFunctions.getLineLoginURL}
    >
      {children || 'Line Login'}
    </OAuthLoginButton>
  );
};

export default OAuthLoginButton;
