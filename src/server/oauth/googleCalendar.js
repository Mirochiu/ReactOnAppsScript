import { OAUTH_CONIFG } from '../settings';
import { getFunForCommonOAuth, getRefreshTokenHandler } from './common';
import {
  getOauthToken,
  getOauthTokenFromJson,
  COLUMN_IDX_OF_BINDS,
} from '../user';
import { log } from '../sheet';

const config = OAUTH_CONIFG.GoogleCalendar;

const fetchRefreshTokenAsJson = getRefreshTokenHandler(config);

const updateToken = (userToken) => {
  const [stringfyToken, setter] = getOauthToken(
    userToken,
    COLUMN_IDX_OF_BINDS.GoogleCalendar
  );
  if (!stringfyToken) throw new Error(`no bind token: ${config.providerName}`);

  log('#debug-google-cal.refresh.stringfyToken', stringfyToken);
  const oldJson = JSON.parse(stringfyToken);

  const refreshToken = oldJson.refresh_token;
  if (!refreshToken) throw new Error('not refresh token');
  log('#debug-google-cal.refresh.refreshToken', refreshToken);

  const newJson = fetchRefreshTokenAsJson(refreshToken);
  log('#debug-google-cal.refresh.newJson', newJson);

  // TODO: check the user in oldJson and newJson

  // copy refresh token
  if (!newJson.refresh_token) {
    newJson.refresh_token = JSON.parse(stringfyToken).refresh_token;
  }

  // save the brand new token
  setter(JSON.stringify(newJson));

  return newJson.access_token;
};

const getBindToken = (userToken) =>
  getOauthTokenFromJson(userToken, COLUMN_IDX_OF_BINDS.GoogleCalendar);

const bindWithUser = (userToken, stringfyToken) => {
  if (!stringfyToken && typeof stringfyToken === 'string')
    throw new Error('should give stringfyToken');
  const [token, setter] = getBindToken(userToken);
  if (token) throw new Error('could not bind the google calendar twice');
  setter(stringfyToken);
  return true;
};

const auth = getFunForCommonOAuth(config, (oauthResponse, resp) => {
  const stringfyToken =
    typeof oauthResponse === 'object'
      ? JSON.stringify(oauthResponse, null, 2)
      : oauthResponse;
  const { state } = resp;
  const userToken = (state || '').substr(config.loginState.length + 1);
  const result = bindWithUser(userToken, stringfyToken);
  if (!result) throw new Error('綁定失敗');
  return 'default' + userToken;
});

const hasBound = (userToken) => {
  if (!userToken) throw new Error('should give userToken');
  try {
    const [token] = getBindToken(userToken);
    return !!token;
  } catch (error) {
    return false;
  }
};

const GoogleCalendar = {
  getBindToken,
  bindWithUser,
  auth,
  hasBound,
  updateToken,
  privFetchRefreshTokenAsJson: fetchRefreshTokenAsJson,
};

export default GoogleCalendar;
