import { OAUTH_CONIFG } from '../settings';
import { loginByOAuth } from '../user';
import { getFunForCommonOAuthLogin } from './common';
import templates from '../templates';

const config = OAUTH_CONIFG.LineLogin;

const OAuth = getFunForCommonOAuthLogin(config, (oauthLogin) => {
  const ourLogin = loginByOAuth(oauthLogin.sub, config.providerName);
  return templates.getSuccess({
    token: ourLogin.token,
    id: oauthLogin.sub,
    name: oauthLogin.name,
    provider: config.providerName,
  });
});

export default OAuth;
