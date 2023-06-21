import { OAUTH_CONIFG } from '../settings';
import { DEFAULT_STATE_CHECKER } from './common';
import GoogleLogin from './googleLogin';
import LineLogin from './lineLogin';
import LineNotify from './lineNotify';

const getOauthHandlerByState = (state) => {
  if (DEFAULT_STATE_CHECKER(OAUTH_CONIFG.GoogleLogin)(state)) {
    return GoogleLogin;
  }
  if (DEFAULT_STATE_CHECKER(OAUTH_CONIFG.LineLogin)(state)) {
    return LineLogin;
  }
  if (DEFAULT_STATE_CHECKER(OAUTH_CONIFG.LineNotify)(state)) {
    return LineNotify;
  }
  return null;
};

export default getOauthHandlerByState;
