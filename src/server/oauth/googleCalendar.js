import { OAUTH_CONIFG } from '../settings';
import { getFunForCommonOAuth } from './common';
import { getOauthTokenFromJson, COLUMN_IDX_OF_BINDS } from '../user';

const config = OAUTH_CONIFG.GoogleCalendar;

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
  return 'default';
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
};

export default GoogleCalendar;
