import imgUr from '../oauth/imgur';

const getToken = (userToken) => imgUr.getBindToken(userToken)[0];

const ImgurApi = {
  getToken,
};

export default ImgurApi;
