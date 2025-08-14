import { getImgurToken } from '../user';

const list = (token, message) => {
  if (!token) throw new Error('token should not be empty');
  if (!message) throw new Error('message should not be empty');

  const [bindToken] = getImgurToken(token);
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

export default {
  list,
  upload,
};
