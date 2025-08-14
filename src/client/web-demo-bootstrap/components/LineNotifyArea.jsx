import React, { useState, useEffect, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { CSSTransition } from 'react-transition-group';
import { serverFunctions } from '../../utils/serverFunctions';
import useAuth from '../hooks/useAuth';
import LoadingState from './LoadingState';
import LineNotifyButton from './LineNotifyButton';

const LineNotifyArea = ({ children }) => {
  const { getToken } = useAuth();

  const [userToken, setUserToken] = useState(null);
  const [bind, setBind] = useState(null);
  const [alert, setAlert] = useState(null);

  const msgRef = useRef();
  const btnRef = useRef();

  useEffect(() => {
    setUserToken(getToken());
  }, []);

  useEffect(() => {
    if (userToken) {
      serverFunctions
        .hasLineNotify(userToken)
        .then((resp) => {
          setBind(!!resp);
        })
        .catch(({ message }) => {
          console.error('hasLineNotify', message);
          setBind(false);
        });
    }
  }, [userToken]);

  const sendNotify = () => {
    const msgEl = msgRef.current;
    const btnEl = btnRef.current;
    btnEl.disabled = true;
    setAlert(null);
    serverFunctions
      .doLineNotify(userToken, msgEl.value)
      .then(({ text }) => {
        console.debug('doLineNotify', text);
        msgEl.value = '';
        setAlert({
          type: 'normal',
          title: '成功',
          message: '通知已送出',
        });
      })
      .catch(({ message }) => {
        console.error('doLineNotify', message);
        setAlert({
          type: 'error',
          title: '錯誤',
          message,
        });
      })
      .finally(() => {
        btnEl.disabled = false;
      });
  };

  const onEnterKey = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendNotify();
    }
  };

  const type2variant = (type) => {
    if (type === 'error') {
      return 'danger';
    }
    return 'primary';
  };

  return (
    <LoadingState done={bind !== null}>
      {bind ? (
        <>
          <h1>LINE通知</h1>
          <input ref={msgRef} type="text" size={30} onKeyDown={onEnterKey} />
          <Button
            ref={btnRef}
            variant="outline-success"
            size="sm"
            onClick={sendNotify}
          >
            送出
          </Button>
          <CSSTransition
            in={!!alert}
            timeout={300}
            classNames="alert"
            unmountOnExit
          >
            <Alert
              variant={type2variant(alert?.type)}
              dismissible
              onClose={() => setAlert(null)}
            >
              <Alert.Heading>{alert?.title}</Alert.Heading>
              <p>{alert?.message}</p>
            </Alert>
          </CSSTransition>
        </>
      ) : (
        <LineNotifyButton userToken={userToken}>{children}</LineNotifyButton>
      )}
    </LoadingState>
  );
};

export default LineNotifyArea;
