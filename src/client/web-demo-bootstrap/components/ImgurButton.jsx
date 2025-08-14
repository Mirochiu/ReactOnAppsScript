import React from 'react';
import OAuthLoginButton from './OAuthLoginButtons';
import { serverFunctions } from '../../utils/serverFunctions';

const ImgurButton = ({ children, userToken }) => {
  if (!userToken) return null;

  return (
    <OAuthLoginButton
      variant="success"
      className="rounded-pill"
      serverFunction={() => serverFunctions.getImgurURL(userToken)}
    >
      {children || 'Bind Imgur'}
    </OAuthLoginButton>
  );
};

export default ImgurButton;
