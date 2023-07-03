import { OAUTH_CONIFG } from '../settings';
import { getFunForCommonOAuth } from './common';
import { bindUserWithImgur } from '../user';

const config = OAUTH_CONIFG.Imgur;

const OAuth = getFunForCommonOAuth(config, (oauthResponse, resp) => {
  const bindToken =
    typeof oauthResponse === 'object'
      ? JSON.stringify(oauthResponse, null, 2)
      : oauthResponse;
  // https://api.imgur.com/oauth2
  const { state } = resp;
  const userToken = (state || '').substr(config.loginState.length + 1);
  const result = bindUserWithImgur(userToken, bindToken);
  if (!result) throw new Error('綁定失敗');
  return 'default';
});

export default OAuth;
