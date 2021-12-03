import { LINE_CONFIG as config, SERVER_URL } from '../settings';
import { loginByOAuth } from '../user';
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

const OAuth = ({ state, code, error, error_description: errorDesc }) => {
  if (error) return outputFailure(error, errorDesc);
  const serverState = config.loginState;
  if (!state || state !== serverState || !code)
    return outputFailure(error, errorDesc);
  try {
    const oauthLogin = parseLogin(fetchToken(code));
    const ourLogin = loginByOAuth(oauthLogin.sub, config.providerName);
    return outputSuccess({
      token: ourLogin.token,
      id: oauthLogin.sub,
      name: oauthLogin.name,
    });
  } catch (except) {
    return logErrorAndOutput(except);
  }
};

export default OAuth;
