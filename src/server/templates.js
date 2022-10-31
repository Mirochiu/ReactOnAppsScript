import { SERVER_URL } from './settings';

const outputFailure = ({ error = '', desc = '', provider = '' }) => {
  const template = HtmlService.createTemplateFromFile('failure');
  template.baseUrl = SERVER_URL;
  template.error = error;
  template.error_description = desc;
  template.loginBy = provider;
  return template.evaluate();
};

const outputSuccess = ({ token = '', name = '', id = '', provider = '' }) => {
  const template = HtmlService.createTemplateFromFile('success');
  template.baseUrl = SERVER_URL;
  template.loginToken = token;
  template.loginName = name;
  template.loginUid = id;
  template.loginBy = provider;
  return template.evaluate();
};

const logErrorAndOutput = (error) => {
  Logger.log('logErrorAndOutput', error);
  return outputFailure({
    error: error.message,
    desc: JSON.stringify(error),
  });
};

const googleBinding = ({
  bindUrl = '',
  bindName = '',
  bindId = '',
  provider = '',
}) => {
  const template = HtmlService.createTemplateFromFile('googleBinding');
  template.baseUrl = SERVER_URL;
  template.bindUrl = bindUrl;
  template.bindName = bindName;
  template.bindUid = bindId;
  template.loginBy = provider;
  return template.evaluate();
};

const defaultPage = () =>
  HtmlService.createTemplateFromFile('index.html').evaluate();

export default {
  logError: logErrorAndOutput,
  getSuccess: outputSuccess,
  getFailure: outputFailure,
  getGoogleBinding: googleBinding,
  getDefault: defaultPage,
};
