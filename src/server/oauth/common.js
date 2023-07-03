import { decodeJwt } from '../jwt';
import { log } from '../sheet';
import Templates from '../templates';

const getTokenHandler = (config) => {
  return (code) => {
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

const DEFAULT_FAILURE_HANDLER = (config) => {
  if (typeof config.onOAuthError === 'function') return config.onOAuthError;
  return (resp, error) => Templates.logError(error);
};

const getFailureHandler = (config = {}) => {
  const onOAuthError = DEFAULT_FAILURE_HANDLER(config);
  if (config.debug) {
    return (resp, error) => {
      log('#debug:oauth-failure', resp, error, error.stack);
      return onOAuthError(resp, error);
    };
  }
  return onOAuthError;
};

const getStateWithJwtChecker =
  ({ loginState }) =>
  (state) => {
    const prefix = loginState || '';
    if (state && state.startsWith(prefix)) {
      const userToken = state.substr(prefix.length + 1);
      // jwt format checker
      if (userToken && userToken.split('.').length === 3) return true;
    }
    return false;
};

export const DEFAULT_STATE_CHECKER = (config) => {
  if (typeof config.checkState === 'function') return config.checkState;
  if (config.stateWithJWT) return getStateWithJwtChecker(config);
  return (state) => state && state === config.loginState;
};

const getStateHandler = (config = {}) => {
  const checkState = DEFAULT_STATE_CHECKER(config);
  if (config.debug) {
    return (state) => {
      log('#debug:oauth-state', state);
      return checkState(state);
    };
  }
  return checkState;
};

export const getFunForCommonOAuth = (config, callback) => {
  const onFailure = getFailureHandler(config);
  const checkState = getStateHandler(config);
  const fetchToken = getTokenHandler(config);
  return (resp) => {
    try {
      const { state, code, error } = resp;

      if (error) {
        // e.g. error_description=user canceled, error='access_denied'
        throw new Error(error, resp.error_description);
      }

      if (!state || !checkState(state)) {
        throw new Error('Invalid state', `state is unacceptable:${state}`);
      }

      if (!code) {
        throw new Error(
          'No Code',
          `Not found code from oauth server:${code} ${state}`
        );
      }

      return callback(fetchToken(code), resp);
    } catch (except) {
      return onFailure(resp, except);
    }
  };
};

const parseLogin = (json) => {
  const user = decodeJwt(json.id_token);
  const nowTime = Date.now();
  if (user.exp > nowTime)
    throw new Error(`login token expired, ${user.exp}>=${nowTime}`);
  return user;
};

export const getFunForCommonOAuthLogin = (config, callback) => {
  return getFunForCommonOAuth(config, (oauthResponse, resp) => {
    const jsonResponse = parseLogin(oauthResponse);
    log(
      '#debug:oauth-login',
      JSON.stringify(oauthResponse, null, 2),
      JSON.stringify(jsonResponse, null, 2),
      JSON.stringify(resp, null, 2)
    );
    return callback(jsonResponse, resp);
  });
};

export default {
  getFunForCommonOAuthLogin,
};
