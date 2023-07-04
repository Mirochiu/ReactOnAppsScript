import { log, getRowsByNonEmptyColumns, getUserSheet } from './sheet';
import { updateAccessTokenOfBindWithUid, COLUMN_IDX_OF_BINDS } from './user';
import LineNotifyApi from './api/lineNotify';
import GoogleCalendarApi from './api/googleCalendar';
import GoogleCalendar from './oauth/googleCalendar';

const event2date = (e) => {
  // 作一下檢驗紀錄,避免後續Apps Script平台有改變策略
  if (e.timezone !== 'UTC') log('trigger event.timezone not utc:', e.timezone);
  const date = new Date(
    Date.UTC(e.year, e.month - 1, e['day-of-month'], e.hour, e.minute, e.second)
  );
  return {
    date,
    event: e,
    hour: date.getHours(),
    wday: date.getDay() === 0 ? 7 : date.getDay(),
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  };
};

const events2message = (events) => {
  if (!Array.isArray(events)) return '日曆資料格式錯誤';
  if (!events.length) return '今日沒有行程';
  return events
    .map((event) => {
      return (
        '- ' +
        event.summary +
        '(' +
        event.start.dateTime.split(/[T+]/)[1] +
        ' ~ ' +
        event.end.dateTime.split(/[T+]/)[1] +
        ')' +
        '\n[' +
        event.htmlLink +
        ']\n'
      );
    })
    .join('\n');
};

// event = {day-of-month=4.0, minute=7.0, timezone=UTC, triggerUid=17267687, day-of-week=2.0, second=36.0, hour=2.0, week-of-year=27.0, year=2023.0, authMode=FULL, month=7.0}
const onTriggered = (event) => {
  try {
    // for test or trigger from editor
    if (event === undefined) {
      log('施行觸發測試中...');
    } else {
      const runAt = event2date(event);
      log('start notify', runAt);

      const memberRows = getRowsByNonEmptyColumns(
        [COLUMN_IDX_OF_BINDS.GoogleCalendar, COLUMN_IDX_OF_BINDS.LineNotify],
        getUserSheet()
      );

      // log('members', memberRows.length, JSON.stringify(memberRows, null, 2));
      log(memberRows.length + ' member(s) is waiting for notify');
      memberRows.forEach((cols) => {
        const uid = cols[0];
        try {
          const lineNotifyToken = cols[COLUMN_IDX_OF_BINDS.LineNotify];
          const calendarJson = JSON.parse(
            cols[COLUMN_IDX_OF_BINDS.GoogleCalendar]
          );
          // log('  ##' + calendarJson.access_token);
          const newCalendarJson = GoogleCalendar.privFetchRefreshTokenAsJson(
            calendarJson.refresh_token
          );
          const calendarToken = newCalendarJson.access_token;
          // log('  ##' + calendarToken);
          updateAccessTokenOfBindWithUid(
            uid,
            COLUMN_IDX_OF_BINDS.GoogleCalendar,
            calendarToken
          );
          const { code, events } =
            GoogleCalendarApi.privFetchEvents(calendarToken);
          if (code !== 200) throw new Error('抓取Google日曆資料失敗' + code);
          const message = events2message(events);
          // log('  ' + uid, message);
          LineNotifyApi.privPostMessage(lineNotifyToken, '\n' + message);
          // log('  nofity' + uid + ' done');
        } catch (errWhenNotify) {
          log(
            '通知' + uid + ' 錯誤:' + errWhenNotify.message,
            errWhenNotify.stack
          );
        }
      });

      log('end nofity');
    }
  } catch (error) {
    log('發生錯誤', error);
  }
};

export default onTriggered;

export const setupTrigger = () => {
  // 這個必須是跟server外部提供的函數名稱相同
  const targetFn = 'onTriggered';

  // 刪除舊有的觸發器（如果存在的話）
  const triggers = ScriptApp.getProjectTriggers();
  for (let i = 0; i < triggers.length; i += 1) {
    if (triggers[i].getHandlerFunction() === targetFn) {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }

  // 設定新的觸發器
  ScriptApp.newTrigger(targetFn)
    .timeBased()
    .everyDays(1)
    .atHour(8)
    .nearMinute(10) // +-15mins
    .create();
};
