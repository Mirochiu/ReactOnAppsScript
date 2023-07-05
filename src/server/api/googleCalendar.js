import googleCalendar from '../oauth/googleCalendar';
import { log, getConfig, setConfig } from '../sheet';
import { auth } from '../user';

const getTodayBeg = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today.toISOString();
};

const getTodayEnd = () => {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return today.toISOString();
};

const fetchCalendars = (accessToken, config = {}) => {
  const url = 'https://www.googleapis.com/calendar/v3/users/me/calendarList';

  const response = UrlFetchApp.fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    muteHttpExceptions: true,
    method: 'get',
  });

  const text = response.getContentText();
  if (config.debug) log('#debug', text);

  return {
    calendars: JSON.parse(text)?.items?.filter((cal) => cal.selected),
    code: response.getResponseCode(),
  };
};

const fetchEvents = (accessToken, config = {}) => {
  const calId =
    typeof config.calendarId !== 'string' || !config.calendarId
      ? 'primary'
      : config.calendarId;

  let url =
    'https://www.googleapis.com/calendar/v3/calendars/' +
    calId.replaceAll('#', '%23').replaceAll('@', '%40').replaceAll('+', '%2B') +
    '/events';
  url += '?eventTypes=default&eventTypes=focusTime&eventTypes=outOfOffice';
  url += '&timeMin=' + encodeURIComponent(getTodayBeg());
  url += '&timeMax=' + encodeURIComponent(getTodayEnd());
  // url += '&maxResults=10';

  const response = UrlFetchApp.fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    muteHttpExceptions: true,
    method: 'get',
  });

  return {
    calId,
    events: JSON.parse(response.getContentText()).items,
    code: response.getResponseCode(),
  };
};

const listTodayEvents = (userToken, config) => {
  if (!userToken) throw new Error('userToken should not be empty');

  const [bindToken] = googleCalendar.getBindToken(userToken);
  if (!bindToken) throw new Error('not found bind token');

  let resp = fetchEvents(bindToken, config);
  if (resp.code >= 400 && resp.code < 500) {
    log('do refresh by code:' + resp.code);
    const newToken = googleCalendar.updateToken(userToken);
    resp = fetchEvents(newToken, config);
  }

  return resp;
};

const listCalendars = (userToken, config) => {
  if (!userToken) throw new Error('userToken should not be empty');

  const [bindToken] = googleCalendar.getBindToken(userToken);
  if (!bindToken) throw new Error('not found bind token');

  let resp = fetchCalendars(bindToken, config);
  if (resp.code >= 400 && resp.code < 500) {
    log('do refresh by code:' + resp.code);
    const newToken = googleCalendar.updateToken(userToken);
    resp = fetchCalendars(newToken, config);
  }

  return resp;
};

const GoogleCalendarApi = {
  listTodayEvents,
  listCalendars,
  hasBound: googleCalendar.hasBound,
  privFetchEvents: fetchEvents,
  privFetchCalendars: fetchCalendars,
  privConcernedCalendars(name) {
    return JSON.parse(getConfig('[' + name + '].ConcernedCalendars') || '[]');
  },
  getConcernedCalendars(t) {
    const { name } = auth(t);
    return getConfig('[' + name + '].ConcernedCalendars');
  },
  setConcernedCalendars(t, list) {
    const { name } = auth(t);
    setConfig('[' + name + '].ConcernedCalendars', list);
  },
};

export default GoogleCalendarApi;
