import { OAUTH_CONIFG } from '../settings';
import { getFunForCommonOAuth } from './common';
import { getOauthTokenFromJson, COLUMN_IDX_OF_BINDS } from '../user';

const config = OAUTH_CONIFG.Imgur;

const getBindToken = (userToken) =>
  getOauthTokenFromJson(userToken, COLUMN_IDX_OF_BINDS.ImgUr);

const bindWithUser = (userToken, stringfyToken) => {
  if (!stringfyToken && typeof stringfyToken === 'string')
    throw new Error('should give bindToken');
  const [hasToken, setter] = getBindToken(userToken);
  if (hasToken) throw new Error('could not bind the imgur twice');
  setter(stringfyToken);
  return true;
};

const auth = getFunForCommonOAuth(config, (oauthResponse, resp) => {
  const bindToken =
    typeof oauthResponse === 'object'
      ? JSON.stringify(oauthResponse, null, 2)
      : oauthResponse;
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

const ImgUr = {
  getBindToken,
  bindWithUser,
  auth,
  hasBound,
};

export default ImgUr;
