import googleCalendar from '../oauth/googleCalendar';

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

const listToday = (token, calendarId) => {
  if (!token) throw new Error('token should not be empty');

  const [bindToken] = googleCalendar.getBindToken(token);
  if (!bindToken) throw new Error('not found bind token');

  const calId =
    typeof calendarId !== 'string' || !calendarId ? 'primary' : calendarId;

  let url =
    'https://www.googleapis.com/calendar/v3/calendars/' + calId + '/events?';
  url += 'eventTypes=' + encodeURIComponent('default');
  url += '&eventTypes=' + encodeURIComponent('focusTime');
  url += '&eventTypes=' + encodeURIComponent('outOfOffice');
  url += '&timeMin=' + encodeURIComponent(getTodayBeg());
  url += '&timeMax=' + encodeURIComponent(getTodayEnd());
  url += '&maxResults=10';

  const response = UrlFetchApp.fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${bindToken}`,
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

const GoogleCalendarApi = {
  listToday,
  hasBound: googleCalendar.hasBound,
};

export default GoogleCalendarApi;
