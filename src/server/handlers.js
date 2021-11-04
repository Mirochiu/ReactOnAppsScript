import { getContentByName } from './content';

const Handlers = {
  default: {
    func: () => HtmlService.createTemplateFromFile('index.html').evaluate(),
  },
  html: {
    func: name => HtmlService.createHtmlOutput(getContentByName(name)),
  },
};

export default function(show) {
  return Handlers[show] || Handlers.default;
}
