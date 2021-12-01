import { getContentByName } from './content';
import { confirmRegistration, confirmOpenIdBinding } from './user';
import LineOAuth, { checkState as isLineState } from './oauth/line';
import GoogleOAuth, { checkState as isGoogleState } from './oauth/google';

const Handlers = {
  default: {
    func: () => HtmlService.createTemplateFromFile('index.html').evaluate(),
  },
  html: {
    func: name => HtmlService.createHtmlOutput(getContentByName(name)),
  },
  'html-source': {
    func: name => {
      let content = '';
      try {
        content = getContentByName(name);
      } catch (error) {
        console.error(`找不到${name}`);
      }
      return ContentService.createTextOutput(content).setMimeType(
        ContentService.MimeType.TEXT
      );
    },
    immediateRetrun: true,
  },
  'download-html': {
    func: name => {
      let content = '';
      try {
        content = getContentByName(name);
      } catch (error) {
        console.error(`找不到${name}`);
      }
      return ContentService.createTextOutput(content)
        .setMimeType(ContentService.MimeType.TEXT)
        .downloadAsFile(`download-${Date.now()}.html`);
    },
    immediateRetrun: true,
  },
  confirmToken: {
    func: confirmRegistration,
    immediateRetrun: true,
  },
  'bind-account': {
    func: confirmOpenIdBinding,
  },
  oauth: {
    func: arg => {
      const { state } = arg;
      if (isLineState(state)) return LineOAuth(arg);
      if (isGoogleState(state)) return GoogleOAuth(arg);
      const template = HtmlService.createTemplateFromFile('failure');
      template.baseUrl = '';
      template.error = '登入問題';
      template.error_description = `未知的登入方法${state}`;
      template.loginBy = '未知';
      return template.evaluate();
    },
  },
};

export default function (show) {
  return Handlers[show] || Handlers.default;
}
