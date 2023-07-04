import { SERVER_URL } from './settings';

export const postProc = (evaluatedTemplate) => {
  if (process.env.FAVICON_URL) {
    evaluatedTemplate.setFaviconUrl(process.env.FAVICON_URL);
  }
  return evaluatedTemplate;
};

const outputFailure = ({ error = '', desc = '', provider = '' }) => {
  const template = HtmlService.createTemplateFromFile('failure');
  template.baseUrl = SERVER_URL;
  template.error = error;
  template.error_description = desc;
  template.loginBy = provider;
  return postProc(template.evaluate());
};

const outputSuccess = ({ token = '', name = '', id = '', provider = '' }) => {
  const template = HtmlService.createTemplateFromFile('success');
  template.baseUrl = SERVER_URL;
  template.loginToken = token;
  template.loginName = name;
  template.loginUid = id;
  template.loginBy = provider;
  return postProc(template.evaluate());
};

const logErrorAndOutput = (error) => {
  Logger.log(`logErrorAndOutput ${error.message}`);
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
  return postProc(template.evaluate());
};

const lineNotifyBinding = ({ provider = '', result = '' }) => {
  const template = HtmlService.createTemplateFromFile('lineNotifyBinding');
  template.baseUrl = SERVER_URL;
  template.result = result;
  template.loginBy = provider;
  return postProc(template.evaluate());
};

const replaceTarget = (content, target, token) => {
  let embedded = '';
  if (token) {
    embedded = 'try{localStorage.setItem(\'reactonappscript.user-token\',\'' + token + '\');}catch(error){console.error(error);}console.debug(\'clear params and hash\');google.script.history.replace(null,\'\',\'\');'
  }
  return content.replace(target, embedded);
};

const defaultPage = (token) => {
  const htmlout = HtmlService.createTemplateFromFile('index.html').evaluate();
  htmlout.setContent(
    replaceTarget(htmlout.getContent(), '@@@loginToken@@@', token)
  );
  return postProc(htmlout);
};

export default {
  logError: logErrorAndOutput,
  getSuccess: outputSuccess,
  getFailure: outputFailure,
  getGoogleBinding: googleBinding,
  getLineNotifyBinding: lineNotifyBinding,
  getDefault: defaultPage,
};
