import { WEB_TITLE } from './settings';
import handlers from './handlers';

export function doGet(req) {
  let { show, state, name } = req.parameter;
  if (state != null) {
    show = 'oauth';
    name = {
      state: state,
      code: req.parameter.code,
      error: req.parameter.error,
      error_description: req.parameter.error_description,
    };
  } else if (show == null) {
    show = 'default';
  }
  const h = handlers(show);
  const output = h.func(name, h.pass);
  if (h.immediateRetrun) return output;
  output.setTitle(WEB_TITLE);
  output.addMetaTag('viewport', 'width=device-width, initial-scale=1');
  return output;
}
