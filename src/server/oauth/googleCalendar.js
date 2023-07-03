import { OAUTH_CONIFG } from '../settings';
import { getFunForCommonOAuth } from './common';
import { bindUserWithGoogleCalendar } from '../user';
import { log } from '../sheet';

const config = OAUTH_CONIFG.GoogleCalendar;

const OAuth = getFunForCommonOAuth(config, (oauthResponse, resp) => {
  const stringfyToken =
    typeof oauthResponse === 'object'
      ? JSON.stringify(oauthResponse, null, 2)
      : oauthResponse;
  if (config.debug)
    log(
      '#debug-bind-google-cal',
      JSON.stringify(oauthResponse, null, 2),
      JSON.stringify(resp, null, 2),
      typeof stringfyToken
    );
  const { state } = resp;
  const userToken = (state || '').substr(config.loginState.length + 1);
  if (config.debug)
    log('#debug-bind-google-cal.2', userToken, typeof userToken);
  const result = bindUserWithGoogleCalendar(userToken, stringfyToken);
  if (!result) throw new Error('綁定失敗');
  return 'default';
});

export default OAuth;
