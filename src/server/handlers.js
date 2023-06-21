import { getContentByName } from './content';
import { confirmRegistration, confirmOpenIdBinding } from './user';
import getOauthHandler from './oauth/getHandler';
import templates, { postProc } from './templates';

const Handlers = {
  default: {
    func: templates.getDefault,
  },
  html: {
    func: (name) =>
      postProc(HtmlService.createHtmlOutput(getContentByName(name))),
  },
  'html-source': {
    func: (name) => {
      let content = '';
      try {
        content = getContentByName(name);
      } catch (error) {
        Logger.log(`找不到${name}`);
      }
      return ContentService.createTextOutput(content).setMimeType(
        ContentService.MimeType.TEXT
      );
    },
    immediateRetrun: true,
  },
  'download-html': {
    func: (name) => {
      let content = '';
      try {
        content = getContentByName(name);
      } catch (error) {
        Logger.log(`找不到${name}`);
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
    func: (arg) => {
      const { state } = arg;
      const oauth = getOauthHandler(state);
      if (oauth) {
        const response = oauth(arg);
        if (response === 'default') {
          return Handlers.default.func();
        }
        return response;
      }
      return templates.getFailure({
        error: '登入問題',
        desc: `未知的登入方法${state}`,
      });
    },
  },
};

const getDefaultHandlers = (show) => {
  return Handlers[show] || Handlers.default;
};

export default getDefaultHandlers;
