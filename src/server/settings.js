import config from '../../config.json';

export const FAVICON_URL = config.FAVICON_URL;
export const WEB_TITLE = '用AppsScript建立React網站';
export const FOLDER_ID = config.GOOGLE_DRIVE_FOLDER_ID;
export const SHEET_URL = config.GOOGLE_SHEET_URL;
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
    callbackUrl: config.SERVER_URL,
    channelId: config.LINE_CHANNEL_ID,
    channelSecret: config.LINE_CHANNEL_SECRET,
    loginState: config.LINE_STATE,
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
    callbackUrl: config.SERVER_URL,
    channelId: config.GOOGLE_CLIENT_ID,
    channelSecret: config.GOOGLE_SECRET,
    loginState: config.GOOGLE_STATE,
  },
  LineNotify: {
    providerName: 'LINE通知',
    authUrl: 'https://notify-bot.line.me/oauth/authorize',
    scopeList: ['notify'],
    tokenUrl: 'https://notify-bot.line.me/oauth/token',
    callbackUrl: config.SERVER_URL,
    channelId: config.LINE_NOTIFY_ID,
    channelSecret: config.LINE_NOTIFY_SECRET,
    loginState: config.LINE_NOTIFY_STATE || '',
    checkState: (state) => {
      const prefix = config.LINE_NOTIFY_STATE || '';
      if (state && state.startsWith(prefix)) {
        const userToken = state.substr(prefix.length + 1);
        // jwt format checker
        if (userToken && userToken.split('.').length === 3) return true;
      }
      return false;
    },
  },
  // https://api.imgur.com/oauth2/addclient
  Imgur: {
    providerName: 'Imgur',
    authUrl: 'https://api.imgur.com/oauth2/authorize',
    scopeList: [],
    tokenUrl: 'https://api.imgur.com/oauth2/token',
    callbackUrl: config.SERVER_URL,
    channelId: config.IMGUR_ID,
    channelSecret: config.IMGUR_SECRET,
    loginState: config.IMGUR_STATE || '',
    checkState: (state) => {
      const prefix = config.IMGUR_STATE || '';
      if (state && state.startsWith(prefix)) {
        const userToken = state.substr(prefix.length + 1);
        // jwt format checker
        if (userToken && userToken.split('.').length === 3) return true;
      }
      return false;
    },
    debug: true,
  },
};
