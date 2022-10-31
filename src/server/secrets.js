export function getGoogleLoginURL() {
  const AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
  const SCOPE =
    'https://www.googleapis.com/auth/userinfo.email%20https://www.googleapis.com/auth/userinfo.profile%20openid';
  const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const CALLBACK_URL = process.env.SERVER_URL;
  const STATE = process.env.GOOGLE_STATE;
  const NONCE = process.env.GOOGLE_NONCE;
  return `${AUTH_URL}?access_type=offline&include_granted_scopes=true&response_type=code&client_id=${CLIENT_ID}&redirect_uri=${CALLBACK_URL}&state=${STATE}&scope=${SCOPE}&nonce=${NONCE}`;
}

export function getLineLoginURL() {
  const LINE_AUTH_URL = 'https://access.line.me/oauth2/v2.1/authorize';
  const SCOPE = 'profile%20openid';
  const CHANNEL_ID = process.env.LINE_CHANNEL_ID;
  const CALLBACK_URL = process.env.SERVER_URL;
  const STATE = process.env.LINE_STATE;
  const NONCE = process.env.LINE_NONCE;
  return `${LINE_AUTH_URL}?response_type=code&client_id=${CHANNEL_ID}&redirect_uri=${CALLBACK_URL}&state=${STATE}&scope=${SCOPE}&nonce=${NONCE}`;
}
