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
  // {
  //     "access_token":"5c3118ebb73fbb275945ab340be60b610a3216d6",
  //     "refresh_token":"d36b474c95bb9ee54b992c7c34fffc2cc343d0a7",
  //     "expires_in":3600,
  //     "token_type":"Bearer",
  //     "account_username":"saponifi3d"
  // }

  const { state } = resp;
  const userToken = (state || '').substr(config.loginState.length + 1);
  const result = bindUserWithImgur(userToken, bindToken);
  if (!result) throw new Error('綁定失敗');
  return 'default';
});

export default OAuth;
