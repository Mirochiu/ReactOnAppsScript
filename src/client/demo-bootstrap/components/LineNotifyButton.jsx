import React from 'react';
import { FiBell } from 'react-icons/fi';
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
      <FiBell />
      {children || 'Bind Line Notify'}
    </OAuthLoginButton>
  );
};

export default LineNotifyButton;
