import { OAUTH_CONIFG } from '../settings';
import { getFunForCommonOAuth } from './common';
import { getOauthToken, COLUMN_IDX_OF_BINDS } from '../user';

const config = OAUTH_CONIFG.LineNotify;

const getBindToken = (userToken) =>
  getOauthToken(userToken, COLUMN_IDX_OF_BINDS.LineNotify);

const bindWithUser = (userToken, bindToken) => {
  if (!bindToken) throw new Error('should give bindToken');
  const [hasToken, setter] = getBindToken(userToken);
  if (hasToken) throw new Error('could not bind the line notify twice');
  setter(bindToken);
  return true;
};

const auth = getFunForCommonOAuth(config, (oauthResponse, resp) => {
  const bindToken = oauthResponse.access_token;
  const { state } = resp;
  const userToken = (state || '').substr(config.loginState.length + 1);
  const result = bindWithUser(userToken, bindToken);
  if (!result) throw new Error('綁定失敗');
  return 'default' + userToken;
});

const hasBound = (userToken) => {
  if (!userToken) throw new Error('should give userToken');
  const [hasToken] = getBindToken(userToken);
  return !!hasToken;
};

const LineNotifyAuth = {
  getBindToken,
  bindWithUser,
  auth,
  hasBound,
};

export default LineNotifyAuth;
