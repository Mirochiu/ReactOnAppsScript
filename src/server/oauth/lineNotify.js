import { OAUTH_CONIFG } from '../settings';
import { getFunForCommonOAuth } from './common';
import { bindUserWithLineNotify } from '../user';

const config = OAUTH_CONIFG.LineNotify;

const OAuth = getFunForCommonOAuth(config, (oauthResponse, resp) => {
  const bindToken = oauthResponse.access_token;
  const { state } = resp;
  const userToken = (state || '').substr(config.loginState.length + 1);
  const result = bindUserWithLineNotify(userToken, bindToken);
  if (!result) throw new Error('綁定失敗');
  return 'default';
});

export default OAuth;
