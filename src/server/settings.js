export const WEB_TITLE = '用AppsScript建立React網站';
export const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;
export const SHEET_URL = process.env.GOOGLE_SHEET_URL;
export const RE_ACCOUNT =
  /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
export const RE_PASSWORD = /^[A-Za-z][A-Za-z0-9]{7,15}$/;
export const SERVER_URL = ScriptApp.getService().getUrl();
export const OAUTH_CONIFG = {
  LineLogin: {
    providerName: 'LINE',
    authUrl: 'https://access.line.me/oauth2/v2.1/authorize',
    scopeList: ['profile', 'openid'],
    tokenUrl: 'https://api.line.me/oauth2/v2.1/token',
    callbackUrl: process.env.SERVER_URL,
    channelId: process.env.LINE_CHANNEL_ID,
    channelSecret: process.env.LINE_CHANNEL_SECRET,
    loginState: process.env.LINE_STATE,
  },
  GoogleLogin: {
    providerName: 'Google',
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    scopeList: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
      'openid',
    ],
    tokenUrl: 'https://oauth2.googleapis.com/token',
    callbackUrl: process.env.SERVER_URL,
    channelId: process.env.GOOGLE_CLIENT_ID,
    channelSecret: process.env.GOOGLE_SECRET,
    loginState: process.env.GOOGLE_STATE,
  },
  LineNotify: {
    providerName: 'LINE通知',
    authUrl: 'https://notify-bot.line.me/oauth/authorize',
    scopeList: ['notify'],
    tokenUrl: 'https://notify-bot.line.me/oauth/token',
    callbackUrl: process.env.SERVER_URL,
    channelId: process.env.LINE_NOTIFY_ID,
    channelSecret: process.env.LINE_NOTIFY_SECRET,
    loginState: process.env.LINE_NOTIFY_STATE || '',
    stateWithJWT: true,
  },
  // https://api.imgur.com/oauth2/addclient
  Imgur: {
    providerName: 'Imgur',
    authUrl: 'https://api.imgur.com/oauth2/authorize',
    scopeList: [],
    tokenUrl: 'https://api.imgur.com/oauth2/token',
    callbackUrl: process.env.SERVER_URL,
    channelId: process.env.IMGUR_ID,
    channelSecret: process.env.IMGUR_SECRET,
    loginState: process.env.IMGUR_STATE || '',
    stateWithJWT: true,
  },
  GoogleCalendar: {
    providerName: 'Google日曆',
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    // https://developers.google.com/identity/protocols/oauth2/scopes?hl=zh-tw#calendar
    scopeList: [
      'https://www.googleapis.com/auth/calendar.readonly',
      // 'https://www.googleapis.com/auth/calendar.events.readonly',
      // 'https://www.googleapis.com/auth/calendar.settings.readonly',
    ],
    tokenUrl: 'https://oauth2.googleapis.com/token',
    refreshUrl: 'https://oauth2.googleapis.com/token',
    callbackUrl: process.env.SERVER_URL,
    channelId: process.env.GOOGLE_CLIENT_ID,
    channelSecret: process.env.GOOGLE_SECRET,
    loginState: process.env.GOOGLE_CAL_STATE,
    stateWithJWT: true,
    debug: true,
  },
};
