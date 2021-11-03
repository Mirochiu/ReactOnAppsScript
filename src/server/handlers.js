const Handlers = {
  default: {
    func: () => HtmlService.createTemplateFromFile('index.html').evaluate(),
  },
};

export default function(show) {
  return Handlers[show] || Handlers.default;
}