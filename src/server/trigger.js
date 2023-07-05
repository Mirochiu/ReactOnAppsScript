import { log, getRowsByNonEmptyColumns, getUserSheet } from './sheet';
import {
  updateAccessTokenOfBindWithUid,
  COLUMN_IDX_OF_BINDS,
  COLUMN_IDX_OF_NAME,
} from './user';
import LineNotifyApi from './api/lineNotify';
import GoogleCalendarApi from './api/googleCalendar';
import GoogleCalendar from './oauth/googleCalendar';

const hhmm = (str) => {
  if (typeof str === 'string') return str.split(/[T+]/)[1] || str;
  return str || '<無法辨識>';
};

const getOnMemberRow = (config) => {
  const { debug, msgWithLink, concernedAll } = config;

  const e2m = (events) => {
    if (!Array.isArray(events)) return '日曆資料格式錯誤';
    if (!events.length) return '今日沒有行程';
    return events
      .map((event) => {
        let msg =
          '- ' +
          event.summary +
          '(' +
          hhmm(event.start.dateTime || event.start.date) +
          ' ~ ' +
          hhmm(event.end.dateTime || event.end.date) +
          ')';
        if (msgWithLink) msg += '\n[' + event.htmlLink + ']';
        return msg;
      })
      .join('\n');
  };

  const lightCal = (c) =>
    c.map(({ id, summary, description, timeZone, selected, primary }) => ({
      id,
      summary,
      selected,
      description,
      timeZone,
      primary: !!primary,
    }));

  return (cols) => {
    const uid = cols[COLUMN_IDX_OF_NAME];
    try {
      let concerdId = () => true;
      if (!concernedAll) {
        // const concerned = [
        //   'xinshi.co@gmail.com', // 寰宇石牌校
        //   '8h5214r1jfk5v58fabiqmj38r0@group.calendar.google.com', // 寰宇各事項日程表
        // ];
        const concerned = GoogleCalendarApi.privConcernedCalendars(uid);
        if (!concerned.length) {
          log(uid, '無關注日曆');
          return;
        }
        if (debug) log(uid, '關注日曆', JSON.stringify(concerned, null, 2));
        concerdId = ({ id }) => concerned.includes(id);
      }

      const lineNotifyToken = cols[COLUMN_IDX_OF_BINDS.LineNotify];
      const calendarJson = JSON.parse(cols[COLUMN_IDX_OF_BINDS.GoogleCalendar]);

      // 這裡是每次都拿refresh去更新token,但是實務上應該是要檢查逾期時間
      const newCalendarJson = GoogleCalendar.privFetchRefreshTokenAsJson(
        calendarJson.refresh_token
      );
      const calendarToken = newCalendarJson.access_token;
      updateAccessTokenOfBindWithUid(
        uid,
        COLUMN_IDX_OF_BINDS.GoogleCalendar,
        calendarToken
      );

      const { code, calendars } =
        GoogleCalendarApi.privFetchCalendars(calendarToken);
      if (code !== 200)
        throw new Error('抓取Google日曆總表失敗,錯誤碼:' + code);

      if (debug)
        log(uid, '日曆總表', JSON.stringify(lightCal(calendars), null, 2));

      let fullMessage = '\n';
      calendars.filter(concerdId).forEach((cal) => {
        const { code: eventCode, events } = GoogleCalendarApi.privFetchEvents(
          calendarToken,
          { calendarId: cal.id }
        );
        if (eventCode !== 200) {
          fullMessage +=
            '從<' + cal.summary + '>抓行程失敗,錯誤碼:' + code + '>\n';
        } else if (!events.length) {
          fullMessage += '<' + cal.summary + '> 沒有行程\n';
        } else {
          if (debug) {
            log(
              '#debug-notify.cal.evnts',
              uid,
              cal.summary,
              JSON.stringify(events)
            );
          }
          fullMessage += '<' + cal.summary + '>\n' + e2m(events) + '\n';
        }
      });
      if (debug) {
        log('#debug-notify.fullmsg', uid, fullMessage);
      } else {
        LineNotifyApi.privPostMessage(lineNotifyToken, fullMessage);
      }
      // log('  nofity' + uid + ' done');
    } catch (errWhenNotify) {
      log('通知:' + uid, ' 錯誤:' + errWhenNotify.message, errWhenNotify.stack);
    }
  };
};

// event = {day-of-month=4.0, minute=7.0, timezone=UTC, triggerUid=17267687, day-of-week=2.0, second=36.0, hour=2.0, week-of-year=27.0, year=2023.0, authMode=FULL, month=7.0}
const onTriggered = (event) => {
  try {
    const config = {
      msgWithLink: true,
    };

    let memberRows = [];
    // for test or trigger from editor
    if (event === undefined) {
      log('施行觸發測試中...');
      const conceredUid = ['U3c9218e564bce1cfbc995d4070e84dd2'];
      if (!conceredUid.length) {
        log('施行觸發測試無關注之會員,已結束');
        return;
      }
      config.debug = true;
      const sheet = getUserSheet();
      const NUM_ROWS = sheet.getLastRow();
      const NUM_COLS = sheet.getLastColumn();
      memberRows = sheet
        .getRange(1, 1, NUM_ROWS, NUM_COLS)
        .getValues()
        .filter((row) => conceredUid.includes(row[COLUMN_IDX_OF_NAME]))
        .filter(
          (r) =>
            r[COLUMN_IDX_OF_BINDS.GoogleCalendar] &&
            r[COLUMN_IDX_OF_BINDS.LineNotify]
        );
    } else {
      log('start notify');
      memberRows = getRowsByNonEmptyColumns(
        [COLUMN_IDX_OF_BINDS.GoogleCalendar, COLUMN_IDX_OF_BINDS.LineNotify],
        getUserSheet()
      );
    }

    // log('members', memberRows.length, JSON.stringify(memberRows, null, 2));
    log(memberRows.length + ' member(s) is waiting for notify');
    memberRows.forEach(getOnMemberRow(config));

    log('end nofity');
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
