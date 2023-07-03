import { WEB_TITLE } from './settings';
import getDefaultHandlers from './webRoutes';

export const doGet = (req) => {
  let { show, name } = req.parameter;
  const { state } = req.parameter;
  if (state != null) {
    show = 'oauth';
    name = {
      state,
      code: req.parameter.code,
      error: req.parameter.error,
      error_description: req.parameter.error_description,
    };
  } else if (show == null) {
    show = 'default';
  }
  const h = getDefaultHandlers(show);
  const output = h.func(name, h.pass);
  if (h.immediateRetrun) return output;
  output.setTitle(WEB_TITLE);
  output.addMetaTag('viewport', 'width=device-width, initial-scale=1');
  return output;
};

export default doGet;
