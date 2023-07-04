import lineNotify from '../oauth/lineNotify';

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

const LineNotifyApi = {
  notify,
  hasBound: lineNotify.hasBound,
  privPostMessage,
};

export default LineNotifyApi;
