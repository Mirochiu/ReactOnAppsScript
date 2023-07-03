import { OAUTH_CONIFG } from '../settings';

export function getGoogleLoginURL() {
  const config = OAUTH_CONIFG.GoogleLogin;
  const AUTH_URL = config.authUrl;
  const SCOPE = config.scopeList.join('%20');
  const CLIENT_ID = config.channelId;
  const CALLBACK_URL = config.callbackUrl;
  const STATE = config.loginState || '';
  const NONCE = config.loginNonce || '';
  return `${AUTH_URL}?access_type=offline&include_granted_scopes=true&response_type=code&client_id=${CLIENT_ID}&redirect_uri=${CALLBACK_URL}&state=${STATE}&scope=${SCOPE}&nonce=${NONCE}`;
}

// https://developers.line.biz/en/reference/line-login/
export function getLineLoginURL() {
  const config = OAUTH_CONIFG.LineLogin;
  const AUTH_URL = config.authUrl;
  const SCOPE = config.scopeList.join('%20');
  const CHANNEL_ID = config.channelId;
  const CALLBACK_URL = config.callbackUrl;
  const STATE = config.loginState || '';
  const NONCE = config.loginNonce || '';
  return `${AUTH_URL}?response_type=code&client_id=${CHANNEL_ID}&redirect_uri=${CALLBACK_URL}&state=${STATE}&scope=${SCOPE}&nonce=${NONCE}`;
}

// https://notify-bot.line.me/doc/en/
export function getLineNotifyURL(token) {
  const config = OAUTH_CONIFG.LineNotify;
  const AUTH_URL = config.authUrl;
  const SCOPE = config.scopeList.join('%20');
  const CHANNEL_ID = config.channelId;
  const CALLBACK_URL = config.callbackUrl;
  const STATE = `${config.loginState}+${token}`;
  return `${AUTH_URL}?response_type=code&client_id=${CHANNEL_ID}&redirect_uri=${CALLBACK_URL}&state=${STATE}&scope=${SCOPE}`;
}

// https://api.imgur.com/oauth2
export function getImgurURL(token) {
  const config = OAUTH_CONIFG.Imgur;
  const AUTH_URL = config.authUrl;
  const CHANNEL_ID = config.channelId;
  const STATE = `${config.loginState}+${token}`;
  return `${AUTH_URL}?response_type=code&client_id=${CHANNEL_ID}&state=${STATE}`;
}

export function getGoogleCalendarURL(token) {
  const config = OAUTH_CONIFG.GoogleCalendar;
  const AUTH_URL = config.authUrl;
  const SCOPE = config.scopeList.join('%20');
  const CLIENT_ID = config.channelId;
  const CALLBACK_URL = config.callbackUrl;
  const STATE = `${config.loginState}+${token}`;
  const NONCE = config.loginNonce || '';
  return `${AUTH_URL}?access_type=offline&include_granted_scopes=true&response_type=code&client_id=${CLIENT_ID}&redirect_uri=${CALLBACK_URL}&state=${STATE}&scope=${SCOPE}&nonce=${NONCE}`;
}
