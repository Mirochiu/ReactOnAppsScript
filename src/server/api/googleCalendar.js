import { getGoogleCalendarToken } from '../user';

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

export const listToday = (token, calendarId) => {
  if (!token) throw new Error('token should not be empty');

  const [bindToken] = getGoogleCalendarToken(token);
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
    fromCalId: calId,
    // '#debug-bindToken': bindToken,
    // '#debug-accessUrl': url.toString(),
    json: JSON.parse(response.getContentText()),
    code: response.getResponseCode(),
  };
};

export default { listToday };
