import { decodeJwt } from '../jwt';
import Templates from '../templates';

const getFuncForFetchToken = config => {
  return code => {
    const response = UrlFetchApp.fetch(config.tokenUrl, {
      contentType: 'application/x-www-form-urlencoded',
      method: 'post',
      payload: {
        grant_type: 'authorization_code',
        redirect_uri: config.callbackUrl,
        code,
        client_id: config.channelId,
        client_secret: config.channelSecret,
      },
    });
    return JSON.parse(response.getContentText());
  };
};

const parseLogin = json => {
  const user = decodeJwt(json.id_token);
  const nowTime = Date.now();
  if (user.exp > nowTime)
    throw new Error(`login token expired, ${user.exp}>=${nowTime}`);
  return user;
};

export const getFunForCommonOAuth = (config, callback) => {
  const fetchToken = getFuncForFetchToken(config);
  return ({ state, code, error, error_description }) => {
    if (error)
      return Templates.getFailure({
        error,
        desc: error_description,
        provider: config.providerName,
      });
    if (!state || state !== config.loginState || !code)
      return Templates.getFailure({
        error,
        desc: error_description,
        provider: config.providerName,
      });
    try {
      return callback(parseLogin(fetchToken(code)));
    } catch (except) {
      return Templates.logError(except);
    }
  };
};

export default {
  getFunForCommonOAuth,
};
