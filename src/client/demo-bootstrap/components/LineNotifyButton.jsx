import React from 'react';
import OAuthLoginButton from './OAuthLoginButtons';
import { serverFunctions } from '../../utils/serverFunctions';

const LineNotifyButton = ({ children, userToken }) => {
  if (!userToken) return null;

  return (
    <OAuthLoginButton
      variant="success"
      className="rounded-pill"
      serverFunction={() => serverFunctions.getLineNotifyURL(userToken)}
    >
      {children || 'Bind Line Notify'}
    </OAuthLoginButton>
  );
};

export default LineNotifyButton;
