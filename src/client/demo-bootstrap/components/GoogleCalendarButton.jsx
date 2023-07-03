import React from 'react';
import OAuthLoginButton from './OAuthLoginButtons';
import { serverFunctions } from '../../utils/serverFunctions';

const GoogleCalendarButton = ({ children, userToken }) => {
  if (!userToken) return null;

  return (
    <OAuthLoginButton
      variant="success"
      className="rounded-pill"
      serverFunction={() => serverFunctions.getGoogleCalendarURL(userToken)}
    >
      {children || 'Bind Google Calendar'}
    </OAuthLoginButton>
  );
};

export default GoogleCalendarButton;
