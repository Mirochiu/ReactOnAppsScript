export const WEB_TITLE = '用AppsScript建立React網站';
export const FOLDER_ID = '1YULbGK5lT3F4kmqpGRnWdKF_cFRK0kOu'; // https://drive.google.com/drive/folders/1YULbGK5lT3F4kmqpGRnWdKF_cFRK0kOu?usp=sharing
export const SHEET_URL =
  'https://docs.google.com/spreadsheets/d/1w6XD5OKvs4WhyV9aayC4M7E2YVfAn7ltIkrGlpws6aQ/edit#gid=0';
export const RE_ACCOUNT = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
export const RE_PASSWORD = /^[A-Za-z][A-Za-z0-9]{7,15}$/;
export const SERVER_URL = ScriptApp.getService().getUrl();
export const LINE_CONFIG = {
  providerName: 'LINE',
  tokenUrl: 'https://api.line.me/oauth2/v2.1/token',
  callbackUrl: process.env.SERVER_URL,
  channelId: process.env.LINE_CHANNEL_ID,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
  loginState: process.env.LINE_STATE,
};
export const GOOGLE_CONFIG = {
  providerName: 'Google',
  tokenUrl: 'https://oauth2.googleapis.com/token',
  callbackUrl: process.env.SERVER_URL,
  channelId: process.env.GOOGLE_CLIENT_ID,
  channelSecret: process.env.GOOGLE_SECRET,
  loginState: process.env.GOOGLE_STATE,
};
