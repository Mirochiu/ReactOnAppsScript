import { decodeJwt } from '../jwt';

export const getFuncforFetchToken = config => {
  return code => {
    const response = UrlFetchApp.fetch(config.tokenUrl, {
      contentType: 'application/x-www-form-urlencoded',
      method: 'post',
      payload: {
        grant_type: 'authorization_code',
        redirect_uri: config.callbackUrl,
        code,
        client_id: config.channelId,
        client_secret: config.channelSecret,
      },
    });
    return JSON.parse(response.getContentText());
  };
};

export const parseLogin = json => {
  const user = decodeJwt(json.id_token);
  const nowTime = Date.now();
  if (user.exp > nowTime)
    throw new Error(`login token expired, ${user.exp}>=${nowTime}`);
  return user;
};

const Common = {
  getFuncforFetchToken,
  parseLogin,
};

export default Common;
