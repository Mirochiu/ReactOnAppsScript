import lineNotify from '../oauth/lineNotify';
import { log } from '../sheet';

/*
curl -X POST -H 'Authorization: Bearer <access_token>' \
-F 'message=foobar' \
https://notify-api.line.me/api/notify

{"status":200,"message":"ok"}
*/
const privPostMessage = (token, message) => {
  const response = UrlFetchApp.fetch('https://notify-api.line.me/api/notify', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: 'post',
    payload: { message },
  });
  return {
    text: response.getContentText(),
    code: response.getResponseCode(),
  };
};

const notify = (token, message) => {
  if (!token) throw new Error('token should not be empty');
  if (!message) throw new Error('message should not be empty');

  const [bindToken] = lineNotify.getBindToken(token);
  if (!bindToken) throw new Error('not found bind token');

  return privPostMessage(bindToken, message);
};

/*
curl -H 'Authorization: Bearer <access_token>' \
https://notify-api.line.me/api/status

{"status":200,"message":"ok","target":"foobar"}
*/
const privValidateToken = (token) => {
  const response = UrlFetchApp.fetch('https://notify-api.line.me/api/status', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: 'get',
  });

  const code = response.getResponseCode();
  const reval = {
    text: response.getContentText(),
    code,
  };

  if (code === 401) {
    reval.result = 'revoked';
  } else if (code === 200) {
    reval.result = 'done';
  } else {
    reval.result = 'error';
  }

  return reval;
};

/*
curl -X POST -H 'Authorization: Bearer <access_token>' \
https://notify-api.line.me/api/revoke

{"status":200,"message":"ok"}
*/
const privRevokeToken = (token) => {
  const response = UrlFetchApp.fetch('https://notify-api.line.me/api/revoke', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: 'post',
  });

  const code = response.getResponseCode();
  const reval = {
    text: response.getContentText(),
    code,
  };

  if (code === 401 || code === 200) {
    reval.result = 'done';
  } else {
    reval.result = 'error';
  }

  return reval;
};

const unbind = (token) => {
  if (!token) throw new Error('token should not be empty');

  const [bindToken, setter] = lineNotify.getBindToken(token);
  if (bindToken) {
    try {
      const resp = privRevokeToken(bindToken);
      log('unbind', JSON.stringify(resp, null, 2));
    } catch (error) {
      log('unbind', error);
    }
    setter('');
  }

  return 'done';
};

const LineNotifyApi = {
  notify,
  hasBound: lineNotify.hasBound,
  privPostMessage,
  privValidateToken,
  privRevokeToken,
  unbind,
};

export default LineNotifyApi;
