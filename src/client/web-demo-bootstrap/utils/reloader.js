import { serverFunctions } from '../../utils/serverFunctions';

export const reload = () => {
  serverFunctions.getServerUrl()
    .then(url => {
      console.debug('reload');
      window.open(url, '_top');
    })
    .catch(err => {
      console.error('reloader err', err.message);
      // cannot reload in google apps script, just try ...
      window.top.location.href = window.top.location.href;
    });
}

export const clearParamsAndHash = () => {
  // refresh, clear state, params and hash
  google.script.history.push(null, '', '');
}
