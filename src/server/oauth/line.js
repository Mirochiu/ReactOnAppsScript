import { LINE_CONFIG, SERVER_URL } from '../settings';
import { loginByLineId } from '../user';

const outputFailure = (error, desc) => {
  const template = HtmlService.createTemplateFromFile('failure');
  template.baseUrl = SERVER_URL;
  template.error = error;
  template.error_description = desc;
  return template.evaluate();
};

const outputSuccess = ({ token, name, id }) => {
  const template = HtmlService.createTemplateFromFile('success');
  template.baseUrl = SERVER_URL;
  template.loginToken = token;
  template.loginName = name;
  template.loginUid = id;
  return template.evaluate();
};

const logErrorAndOutput = error => {
  Logger.log('logErrorAndOutput', error);
  return outputFailure(error.message, JSON.stringify(error));
};

function decodeJwtInObjectForm(jwt) {
  const payload = jwt.split('.')[1];
  const blob = Utilities.newBlob(
    Utilities.base64DecodeWebSafe(payload, Utilities.Charset.UTF_8)
  );
  return JSON.parse(blob.getDataAsString());
}

const parseLineLogin = json => {
  const lineUser = decodeJwtInObjectForm(json.id_token);
  const nowTime = Date.now();
  if (lineUser.exp > nowTime)
    throw new Error(`login token expired, ${lineUser.exp}>=${nowTime}`);
  return lineUser;
};

const fetchToken = code => {
  const response = UrlFetchApp.fetch(LINE_CONFIG.tokenUrl, {
    contentType: 'application/x-www-form-urlencoded',
    method: 'post',
    payload: {
      grant_type: 'authorization_code',
      redirect_uri: LINE_CONFIG.callbackUrl,
      code,
      client_id: LINE_CONFIG.channelId,
      client_secret: LINE_CONFIG.channelSecret,
    },
  });
  return JSON.parse(response.getContentText());
};

const OAuth = ({ state, code, error, error_description: errorDesc }) => {
  if (error) return outputFailure(error, errorDesc);
  const serverState = LINE_CONFIG.loginState;
  if (!state || state !== serverState || !code)
    return outputFailure(error, errorDesc);
  try {
    const lineLogin = parseLineLogin(fetchToken(code));
    const ourLogin = loginByLineId(lineLogin.sub);
    return outputSuccess({
      token: ourLogin.token,
      id: lineLogin.sub,
      name: lineLogin.name,
    });
  } catch (except) {
    return logErrorAndOutput(except);
  }
};

export default OAuth;
