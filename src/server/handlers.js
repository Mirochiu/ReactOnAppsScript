import { getContentByName } from './content';
import { confirmRegistration } from './user';

const Handlers = {
  default: {
    func: () => HtmlService.createTemplateFromFile('index.html').evaluate(),
  },
  html: {
    func: name => HtmlService.createHtmlOutput(getContentByName(name)),
  },
  confirmToken: {
    func: confirmRegistration,
    immediateRetrun: true,
  },
};

export default function(show) {
  return Handlers[show] || Handlers.default;
}
