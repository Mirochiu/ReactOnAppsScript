import { WEB_TITLE } from './settings';
import handlers from './handlers';

export function doGet(req) {
  const { show } = req.parameter;
  const h = handlers(show == null ? 'default' : show);
  const output = h.func(req.parameter.name, h.pass);
  if (h.immediateRetrun) return output;
  output.setTitle(WEB_TITLE);
  output.addMetaTag('viewport', 'width=device-width, initial-scale=1');
  return output;
}

export function getServerUrl() {
  return ScriptApp.getService().getUrl();
}
