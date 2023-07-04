import { OAUTH_CONIFG, SERVER_URL } from '../settings';
import { loginByOAuth, loginByOpenId, createGoogleBinding } from '../user';
import { getFunForCommonOAuthLogin } from './common';
import templates from '../templates';

const config = OAUTH_CONIFG.GoogleLogin;

const getTokenBindingUrl = (token) =>
  `${SERVER_URL}?show=bind-account&name=${token}`;

const auth = getFunForCommonOAuthLogin(config, (oauthLogin) => {
  try {
    const { sub: openId, name } = oauthLogin;
    // use the bind user for login
    const openIdLogin = loginByOpenId(openId, config.providerName);
    if (openIdLogin) {
      return 'default' + openIdLogin.token;
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
    return 'default' + ourLogin.token;
  } catch (except) {
    return templates.logError(except);
  }
});

const GoogleLoginAuth = {
  auth,
};

export default GoogleLoginAuth;
