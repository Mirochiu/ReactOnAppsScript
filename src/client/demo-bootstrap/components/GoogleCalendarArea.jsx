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

const GoogleCalendarArea = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [bind, setBind] = useState(null);
  const [alert, setAlert] = useState(null);
  const [eventList, setEvents] = useState(null);
  const [reloadList, reloadImgList] = useState(false);

  const reloadBtnRef = useRef();

  const { getToken } = useAuth();

  useEffect(() => {
    setUserToken(getToken());
  }, []);

  useEffect(() => {
    if (userToken) {
      serverFunctions
        .hasGoogleCalendarToken(userToken)
        .then((resp) => {
          setBind(!!resp);
        })
        .catch(({ message }) => {
          console.error('hasGoogleCalendarToken', message);
          setBind(false);
        });
    }
  }, [userToken]);

  const enableEl = (el, enabled) => {
    if (el) {
      el.disabled = !enabled;
    }
  };

  useEffect(() => {
    if (bind) {
      enableEl(reloadBtnRef.current, false);
      serverFunctions
        .listGoogleCanlendarToday(userToken)
        .then((resp) => {
          // console.debug('listGoogleCanlendarToday', resp);
          if (resp.code < 200 || resp.code >= 300) {
            const error = new Error('response code invalid');
            error.data = resp;
            console.error('listGoogleCanlendarToday', resp);
            throw error;
          }
          const events = ToEvents(resp.events);
          setEvents(events);
        })
        .catch(({ message }) => {
          console.error('listGoogleCanlendarToday', message);
          setAlert({
            type: 'error',
            title: '錯誤',
            message,
          });
        })
        .finally(() => {
          enableEl(reloadBtnRef.current, true);
        });
    }
  }, [bind, reloadList]);

  const reloadEvents = () => {
    setEvents(null);
    reloadImgList((v) => !v);
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
