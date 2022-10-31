import { GOOGLE_CONFIG as config, SERVER_URL } from '../settings';
import { loginByOAuth, loginByOpenId, createGoogleBinding } from '../user';
import { getFunForCommonOAuth } from './common';
import templates from '../templates';

export const checkState = (state) => state === config.loginState;

const getTokenBindingUrl = (token) =>
  `${SERVER_URL}?show=bind-account&name=${token}`;

const OAuth = getFunForCommonOAuth(config, (oauthLogin) => {
  try {
    const { sub: openId, name } = oauthLogin;
    // use the bind user for login
    const openIdLogin = loginByOpenId(openId, config.providerName);
    if (openIdLogin) {
      return templates.getSuccess({
        token: openIdLogin.token,
        id: openId,
        name,
        provider: config.providerName,
      });
    }
    // ask user to bind if the email has been registered.
    const email = oauthLogin.email_verified ? oauthLogin.email : null;
    if (email) {
      const bindToken = createGoogleBinding(email, openId);
      if (bindToken) {
        return templates.getGoogleBinding({
          bindUrl: getTokenBindingUrl(bindToken),
          bindId: email,
          bindName: name,
          provider: config.providerName,
        });
      }
    }
    // simple login
    const ourLogin = loginByOAuth(openId, config.providerName);
    return templates.getSuccess({
      token: ourLogin.token,
      id: openId,
      name,
      provider: config.providerName,
    });
  } catch (except) {
    return templates.logError(except);
  }
});

export default OAuth;
