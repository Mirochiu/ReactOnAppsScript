import { GOOGLE_CONFIG as config, SERVER_URL } from '../settings';
import { loginByOAuth, loginByOpenId, createGoogleBinding } from '../user';
import { getFuncforFetchToken, parseLogin } from './common';

const fetchToken = getFuncforFetchToken(config);

export const checkState = state => state === config.loginState;

const outputFailure = (error, desc) => {
  const template = HtmlService.createTemplateFromFile('failure');
  template.baseUrl = SERVER_URL;
  template.error = error;
  template.error_description = desc;
  template.loginBy = config.providerName;
  return template.evaluate();
};

const outputBind = ({ bindUrl, bindName, bindId }) => {
  const template = HtmlService.createTemplateFromFile('googleBinding');
  template.baseUrl = SERVER_URL;
  template.bindUrl = bindUrl;
  template.bindName = bindName;
  template.bindUid = bindId;
  template.loginBy = config.providerName;
  return template.evaluate();
};

const outputSuccess = ({ token, name, id }) => {
  const template = HtmlService.createTemplateFromFile('success');
  template.baseUrl = SERVER_URL;
  template.loginToken = token;
  template.loginName = name;
  template.loginUid = id;
  template.loginBy = config.providerName;
  return template.evaluate();
};

const logErrorAndOutput = error => {
  Logger.log('logErrorAndOutput', error);
  return outputFailure(error.message, JSON.stringify(error));
};

const getTokenBindingUrl = token =>
  `${SERVER_URL}?show=bind-account&name=${token}`;

const OAuth = ({ state, code, error, error_description: errorDesc }) => {
  if (error) return outputFailure(error, errorDesc);
  const serverState = config.loginState;
  if (!state || state !== serverState || !code)
    return outputFailure(error, errorDesc);
  try {
    const oauthLogin = parseLogin(fetchToken(code));
    const { sub: openId, name } = oauthLogin;
    // use the bind user for login
    const openIdLogin = loginByOpenId(openId, config.providerName);
    if (openIdLogin) {
      return outputSuccess({
        token: openIdLogin.token,
        id: openId,
        name,
      });
    }
    // ask user to bind if the email has been registered.
    const email = oauthLogin.email_verified ? oauthLogin.email : null;
    if (email) {
      const bindToken = createGoogleBinding(email, openId);
      if (bindToken) {
        return outputBind({
          bindUrl: getTokenBindingUrl(bindToken),
          bindId: email,
          bindName: name,
        });
      }
    }
    // simple login
    const ourLogin = loginByOAuth(openId, config.providerName);
    return outputSuccess({
      token: ourLogin.token,
      id: openId,
      name,
    });
  } catch (except) {
    return logErrorAndOutput(except);
  }
};

export default OAuth;
