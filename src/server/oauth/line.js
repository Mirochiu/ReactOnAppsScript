import { LINE_CONFIG as config } from '../settings';
import { loginByOAuth } from '../user';
import { getFunForCommonOAuth } from './common';
import templates from '../templates';

export const checkState = state => state === config.loginState;

const OAuth = getFunForCommonOAuth(config, oauthLogin => {
  const ourLogin = loginByOAuth(oauthLogin.sub, config.providerName);
  return templates.getSuccess({
    token: ourLogin.token,
    id: oauthLogin.sub,
    name: oauthLogin.name,
    provider: config.providerName,
  });
});

export default OAuth;
