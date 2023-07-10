import { OAUTH_CONIFG } from '../settings';

const oauthConfig2URL = (config, token) => {
  const { authUrl, urlConfig, stateWithJWT } = config;
  const params = Object.keys(urlConfig)
    .map((k) => {
      if (k === 'state' && stateWithJWT)
        return k + '=' + encodeURIComponent(urlConfig[k]) + '+' + token;
      if (k === 'scope' && Array.isArray(urlConfig[k]))
        return k + '=' + encodeURIComponent(urlConfig[k].join(' '));
      return k + '=' + encodeURIComponent(urlConfig[k]);
    })
    .join('&');
  return authUrl + '?' + params;
};

export function getGoogleLoginURL() {
  const config = OAUTH_CONIFG.GoogleLogin;
  return oauthConfig2URL(config);
}

// https://developers.line.biz/en/reference/line-login/
export function getLineLoginURL() {
  const config = OAUTH_CONIFG.LineLogin;
  return oauthConfig2URL(config);
}

// https://notify-bot.line.me/doc/en/
export function getLineNotifyURL(token) {
  const config = OAUTH_CONIFG.LineNotify;
  return oauthConfig2URL(config, token);
}

// https://api.imgur.com/oauth2
export function getImgurURL(token) {
  const config = OAUTH_CONIFG.Imgur;
  return oauthConfig2URL(config, token);
}

export function getGoogleCalendarURL(token) {
  const config = OAUTH_CONIFG.GoogleCalendar;
  return oauthConfig2URL(config, token);
}
