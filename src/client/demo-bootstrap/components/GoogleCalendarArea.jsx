import React, { useState, useEffect, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import { BiRefresh } from 'react-icons/bi';
import { serverFunctions } from '../../utils/serverFunctions';
import useAuth from '../hooks/useAuth';
import LoadingState from './LoadingState';
import MessagePanel from './MessagePanel';
import GoogleCalendarButton from './GoogleCalendarButton';

const ToEvents = (events) => {
  // console.debug(JSON.stringify(events, null, 2));
  return events.map((event) => ({
    id: event.id,
    summary: event.summary,
    url: event.htmlLink,
    startTime: event.start.dateTime,
    endTime: event.end.dateTime,
    type: event.eventType,
    iCalUID: event.iCalUID,
  }));
};

const ToCalendars = (cals) => {
  // console.debug(JSON.stringify(cals, null, 2));
  return cals.map((cal) => ({
    id: cal.id,
    summary: cal.summary,
    selected: cal.selected,
    description: cal.description,
    primary: !!cal.primary,
  }));
};

const EventLister = ({ list, onDeletion }) => {
  if (!Array.isArray(list)) return undefined;
  if (list.length === 0) return <p>沒有資料</p>;
  const supportDetele = typeof onDeletion === 'function';
  return (
    <table border="1">
      <thead>
        <tr>
          <th>行程</th>
          <th>開始/結束</th>
          {supportDetele && <th>刪除</th>}
        </tr>
      </thead>
      <tbody>
        {list.map((event, index) => {
          return (
            <tr key={`tr-${index}`} data-event-id={event.id}>
              <td>
                <a href={event.url} target="_blank" rel="noreferrer">
                  {event.summary}
                </a>
              </td>
              <td>
                {event.startTime} ~ <br /> {event.endTime}
              </td>
              {supportDetele && (
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    data-delete-hash={event.deletehash}
                    onClick={(e) => onDeletion(e.target.dataset.deleteHash)}
                  >
                    刪除
                  </Button>
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const CalendarLister = ({ list, concerned, onClick }) => {
  if (!Array.isArray(list)) return undefined;
  if (list.length === 0) return <p>沒有資料</p>;
  return (
    <div>
      {list.map((calendar, index) => {
        const cid = calendar.id;
        const name = `cal-${index}`;
        return (
          <div key={name}>
            <input
              id={name}
              className="form-check-input"
              type="checkbox"
              data-cal-id={cid}
              title={calendar.description}
              onClick={onClick}
              checked={concerned instanceof Set ? concerned.has(cid) : false}
            />
            <label className="form-check-label" htmlFor={name}>
              {calendar.summary}
            </label>
          </div>
        );
      })}
    </div>
  );
};

const GoogleCalendarArea = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [bind, setBind] = useState(null);
  const [concernedSet, setConcerned] = useState(null);
  const [alert, setAlert] = useState(null);
  const [eventList, setEvents] = useState(null);
  const [calendarList, setCalendars] = useState(null);
  const [reloadList, reloadImgList] = useState(false);
  const [isSaving, setSaved] = useState(null);

  const reloadBtnRef = useRef();

  const { getToken } = useAuth();

  useEffect(() => {
    setUserToken(getToken());
  }, []);

  useEffect(() => {
    if (!userToken) return;
    serverFunctions
      .hasGoogleCalendarToken(userToken)
      .then((resp) => {
        setBind(!!resp);
      })
      .catch(({ message }) => {
        console.error('hasGoogleCalendarToken', message);
        setBind(false);
      });
  }, [userToken]);

  const enableEl = (el, enabled) => {
    if (el) {
      el.disabled = !enabled;
    }
  };

  useEffect(() => {
    if (!bind) return;
    enableEl(reloadBtnRef.current, false);
    serverFunctions
      .listTodayEventsOnGoogleCanlendar(userToken)
      .then((resp) => {
        // console.debug('listTodayEventsOnGoogleCanlendar', resp);
        if (resp.code < 200 || resp.code >= 300) {
          const error = new Error('response code invalid');
          error.data = resp;
          console.error('listTodayEventsOnGoogleCanlendar', resp);
          throw error;
        }
        const events = ToEvents(resp.events);
        setEvents(events);
      })
      .catch(({ message }) => {
        console.error('listTodayEventsOnGoogleCanlendar', message);
        setAlert({
          type: 'error',
          title: '錯誤',
          message,
        });
      })
      .finally(() => {
        enableEl(reloadBtnRef.current, true);
      });
  }, [userToken, bind, reloadList]);

  const reloadEvents = () => {
    setEvents(null);
    reloadImgList((v) => !v);
  };

  useEffect(() => {
    if (!userToken || !bind) return;
    serverFunctions
      .listCalendarsOnGoogleCalendar(userToken)
      .then((resp) => {
        // console.debug('listCalendarsOnGoogleCalendar', resp);
        if (resp.code < 200 || resp.code >= 300) {
          const error = new Error('response code invalid');
          error.data = resp;
          console.error('listCalendarsOnGoogleCalendar', resp);
          throw error;
        }
        const calendars = ToCalendars(resp.calendars);
        setCalendars(calendars);
      })
      .catch(({ message }) => {
        console.error('listCalendarsOnGoogleCalendar', message);
        setAlert({
          type: 'error',
          title: '錯誤',
          message,
        });
      });
  }, [userToken, bind]);

  useEffect(() => {
    if (!userToken) return;
    if (concernedSet instanceof Set) {
      setSaved(null);
      const concernedList = Array.from(concernedSet);
      // console.debug('set ConcernedCalendars', concernedList);
      serverFunctions
        .ConcernedCalendars(userToken, JSON.stringify(concernedList))
        .then(() => setSaved(true))
        .catch((err) => {
          console.debug('set ConcernedCalendars', err);
          setSaved(false);
        });
    } else {
      // console.debug('get ConcernedCalendars');
      serverFunctions.ConcernedCalendars(userToken)
        .then((resp) => {
          // console.log('ConcernedCalendars', resp);
          setConcerned(new Set(JSON.parse(resp || '[]')));
        })
        .catch((err) => {
          console.debug('get ConcernedCalendars', err);
          setConcerned(false);
        });
    }
  }, [userToken, concernedSet]);

  const onCalendarClicked = ({ target }) => {
    const cid = target.dataset.calId;
    const checked = target.checked;
    // console.debug('onCalendarClicked', cid, checked);
    setConcerned((set) => {
      if (!set) return set;
      const s = new Set(set);
      if (checked) s.add(cid);
      else s.delete(cid);
      return s;
    });
  };

  return (
    <LoadingState done={bind !== null}>
      {bind ? (
        <div>
          <h1>
            Google日曆今日行程
            <Button
              ref={reloadBtnRef}
              variant="outline-success"
              size="sm"
              onClick={reloadEvents}
              title="重新整理"
              className="ml-3"
            >
              <BiRefresh></BiRefresh>
            </Button>
          </h1>
          <MessagePanel msgObj={alert} onClose={() => setAlert(null)} />
          <LoadingState done={calendarList !== null}>
            <p>
              關注日曆:
              <LoadingState done={isSaving !== null}>
                {isSaving ? '已儲存' : '儲存失敗'}
              </LoadingState>
            </p>
            <CalendarLister
              list={calendarList}
              concerned={concernedSet}
              onClick={onCalendarClicked}
            />
          </LoadingState>
          <LoadingState done={eventList !== null}>
            <EventLister list={eventList} />
          </LoadingState>
        </div>
      ) : (
        <GoogleCalendarButton userToken={userToken}>
          {children}
        </GoogleCalendarButton>
      )}
    </LoadingState>
  );
};

export default GoogleCalendarArea;
