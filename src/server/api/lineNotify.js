import lineNotify from '../oauth/lineNotify';

const notify = (token, message) => {
  if (!token) throw new Error('token should not be empty');
  if (!message) throw new Error('message should not be empty');

  const [bindToken] = lineNotify.getBindToken(token);
  if (!bindToken) throw new Error('not found bind token');

  const response = UrlFetchApp.fetch('https://notify-api.line.me/api/notify', {
    headers: {
      Authorization: `Bearer ${bindToken}`,
    },
    method: 'post',
    payload: { message },
  });
  return {
    text: response.getContentText(),
    code: response.getResponseCode(),
  };
};

const LineNotifyApi = {
  notify,
  hasBound: lineNotify.hasBound,
};

export default LineNotifyApi;
