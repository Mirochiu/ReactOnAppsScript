import googleCalendar from '../oauth/googleCalendar';
import { log } from '../sheet';

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

const fetchEvents = (accessToken, config = {}) => {
  const calId =
    typeof config.calendarId !== 'string' || !config.calendarId
      ? 'primary'
      : config.calendarId;

  let url =
    'https://www.googleapis.com/calendar/v3/calendars/' + calId + '/events';
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

const listToday = (userToken, calendarId) => {
  if (!userToken) throw new Error('userToken should not be empty');

  const config = { calendarId };

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

const GoogleCalendarApi = {
  listToday,
  hasBound: googleCalendar.hasBound,
  privFetchEvents: fetchEvents,
};

export default GoogleCalendarApi;
