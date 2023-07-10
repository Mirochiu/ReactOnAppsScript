export const WEB_TITLE = '用AppsScript建立React網站';
export const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;
export const SHEET_URL = process.env.GOOGLE_SHEET_URL;
export const RE_ACCOUNT =
  /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
export const RE_PASSWORD = /^[A-Za-z][A-Za-z0-9]{7,15}$/;
export const SERVER_URL = ScriptApp.getService().getUrl();
export const API_KEYS = {
  TinyPNG: process.env.TINYPNG_KEY,
};
export const OAUTH_CONIFG = {
  LineLogin: {
    providerName: 'LINE',
    authUrl: 'https://access.line.me/oauth2/v2.1/authorize',
    tokenUrl: 'https://api.line.me/oauth2/v2.1/token',
    channelId: process.env.LINE_CHANNEL_ID,
    channelSecret: process.env.LINE_CHANNEL_SECRET,
    loginState: process.env.LINE_STATE,
    urlConfig: {
      response_type: 'code',
      client_id: process.env.LINE_CHANNEL_ID,
      redirect_uri: process.env.SERVER_URL,
      state: process.env.LINE_STATE,
      scope: ['profile', 'openid'],
      initial_amr_display: 'lineqr', // optional
    },
  },
  GoogleLogin: {
    providerName: 'Google',
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    channelId: process.env.GOOGLE_CLIENT_ID,
    channelSecret: process.env.GOOGLE_SECRET,
    loginState: process.env.GOOGLE_STATE,
    debug: true,
    urlConfig: {
      access_type: 'offline',
      include_granted_scopes: true,
      response_type: 'code',
      client_id: process.env.GOOGLE_CLIENT_ID,
      redirect_uri: process.env.SERVER_URL,
      state: process.env.GOOGLE_STATE,
      scope: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
        'openid',
      ],
    },
  },
  LineNotify: {
    providerName: 'LINE通知',
    authUrl: 'https://notify-bot.line.me/oauth/authorize',
    tokenUrl: 'https://notify-bot.line.me/oauth/token',
    channelId: process.env.LINE_NOTIFY_ID,
    channelSecret: process.env.LINE_NOTIFY_SECRET,
    loginState: process.env.LINE_NOTIFY_STATE || '',
    stateWithJWT: true,
    urlConfig: {
      response_type: 'code',
      client_id: process.env.LINE_NOTIFY_ID,
      redirect_uri: process.env.SERVER_URL,
      state: process.env.LINE_NOTIFY_STATE,
      scope: 'notify',
      initial_amr_display: 'lineqr', // optional
    },
  },
  // https://api.imgur.com/oauth2/addclient
  Imgur: {
    providerName: 'Imgur',
    authUrl: 'https://api.imgur.com/oauth2/authorize',
    tokenUrl: 'https://api.imgur.com/oauth2/token',
    channelId: process.env.IMGUR_ID,
    channelSecret: process.env.IMGUR_SECRET,
    loginState: process.env.IMGUR_STATE || '',
    stateWithJWT: true,
    urlConfig: {
      response_type: 'code',
      client_id: process.env.LINE_NOTIFY_ID,
      redirect_uri: process.env.SERVER_URL,
      state: process.env.IMGUR_STATE,
    },
  },
  GoogleCalendar: {
    providerName: 'Google日曆',
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    refreshUrl: 'https://oauth2.googleapis.com/token',
    channelId: process.env.GOOGLE_CLIENT_ID,
    channelSecret: process.env.GOOGLE_SECRET,
    loginState: process.env.GOOGLE_CAL_STATE,
    stateWithJWT: true,
    debug: true,
    urlConfig: {
      access_type: 'offline',
      include_granted_scopes: true,
      response_type: 'code',
      client_id: process.env.GOOGLE_CLIENT_ID,
      redirect_uri: process.env.SERVER_URL,
      state: process.env.GOOGLE_CAL_STATE,
      // https://developers.google.com/identity/protocols/oauth2/scopes?hl=zh-tw#calendar
      scope: [
        'https://www.googleapis.com/auth/calendar.readonly',
        // 'https://www.googleapis.com/auth/calendar.events.readonly',
        // 'https://www.googleapis.com/auth/calendar.settings.readonly',
      ],
    },
  },
};
