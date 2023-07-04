import { OAUTH_CONIFG } from '../settings';
import { loginByOAuth } from '../user';
import { getFunForCommonOAuthLogin } from './common';

const config = OAUTH_CONIFG.LineLogin;

const auth = getFunForCommonOAuthLogin(config, (oauthLogin) => {
  const ourLogin = loginByOAuth(oauthLogin.sub, config.providerName);
  return 'default' + ourLogin.token;
});

const LineLoginAuth = {
  auth,
};

export default LineLoginAuth;
