import React, { useState, useEffect, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import { FiBell } from 'react-icons/fi';
import { BsSend, BsUnlock } from 'react-icons/bs';
import { CSSTransition } from 'react-transition-group';
import Modal from 'react-bootstrap/Modal';
import { serverFunctions } from '../../utils/serverFunctions';
import useAuth from '../hooks/useAuth';
import LoadingState from './LoadingState';
import LineNotifyButton from './LineNotifyButton';

const type2variant = (type) => {
  if (type === 'error') {
    return 'danger';
  }
  return 'primary';
};

const LineNotifyArea = ({ children }) => {
  const { getToken } = useAuth();

  const [userToken, setUserToken] = useState(null);
  const [bind, setBind] = useState(null);
  const [alert, setAlert] = useState(null);
  const [state, setState] = useState(null);
  const [modal, setModal] = useState(null);

  const handleClose = () => setModal(null);

  const setRunning = () => setState('running');
  const setEnded = () => setState('ended');

  const msgRef = useRef();

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

  if (!bind) {
    return (
      <LoadingState done={bind !== null}>
        <LineNotifyButton userToken={userToken}>{children}</LineNotifyButton>
      </LoadingState>
    );
  }

  const unbindNotifyAsync = async () => {
    setRunning();
    setAlert(null);
    try {
      const resp = await serverFunctions.unbindLineNotify(userToken);
      console.debug('unbindLineNotify', resp);
      setBind(false);
      if (resp.result === 'error') {
        const err = new Error('雖然解綁時發生錯誤,但是紀錄已經移除');
        err.resp = resp;
        throw err;
      }
    } catch ({ message }) {
      console.error('unbindLineNotify', message);
      setAlert({
        type: 'error',
        title: '錯誤',
        message,
      });
    } finally {
      setEnded();
    }
  };

  const sendNotify = () => {
    setRunning();
    setAlert(null);
    serverFunctions
      .sendLineNotify(userToken, msgRef.current.value)
      .then(({ text }) => {
        console.debug('sendLineNotify', text);
        msgRef.current.value = '';
        setAlert({
          type: 'normal',
          title: '成功',
          message: '通知已送出',
        });
      })
      .catch(({ message }) => {
        console.error('sendLineNotify', message);
        setAlert({
          type: 'error',
          title: '錯誤',
          message,
        });
      })
      .finally(setEnded);
  };

  const onEnterKey = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendNotify();
    }
  };

  const AlertVarient = type2variant(alert?.type);

  const isRunning = state === 'running';

  return (
    <Container>
      <Row>
        <Col className="h1 text-center text-md-start text-success">
          <FiBell />
          LINE通知
        </Col>
      </Row>
      <Row className="justify-content-center">
        <input
          className="col-12 col-md-6"
          ref={msgRef}
          disabled={isRunning}
          type="text"
          onKeyDown={onEnterKey}
        />
        <Button
          className="col-4 col-md-2"
          disabled={isRunning}
          variant="outline-success"
          onClick={sendNotify}
        >
          <BsSend />
          送出
        </Button>
        <Button
          className="col-4 col-md-2"
          disabled={isRunning}
          variant="outline-danger"
          onClick={() =>
            setModal({
              title: '解除LINE通知綁定',
              body: '解除LINE通知綁定之後，您將無法再收到任何通知，請問確定要這樣作嗎？',
              secondaryBtn: {
                onClick: handleClose,
                variant: 'secondary',
                title: '不要解綁',
              },
              primaryBtn: {
                onClick: () => unbindNotifyAsync().finally(handleClose),
                variant: 'danger',
                title: '確認解綁',
              },
            })
          }
        >
          <BsUnlock />
          解綁
        </Button>
        {isRunning && <Spinner animation="border" />}
      </Row>
      <CSSTransition
        in={!!alert}
        timeout={300}
        classNames="alert"
        unmountOnExit
      >
        <Alert
          variant={AlertVarient}
          dismissible
          onClose={() => setAlert(null)}
        >
          <Alert.Heading>{alert?.title}</Alert.Heading>
          <p>{alert?.message}</p>
        </Alert>
      </CSSTransition>
      <Modal show={modal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{modal?.title || '沒有標題'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modal?.body || '沒有內容'}</Modal.Body>
        <Modal.Footer>
          {typeof modal?.secondaryBtn === 'object' && (
            <Button
              variant="secondary"
              onClick={modal.secondaryBtn?.onClick || handleClose}
            >
              {modal.secondaryBtn.title}
            </Button>
          )}
          {typeof modal?.primaryBtn === 'object' && (
            <Button
              variant={modal.primaryBtn.variant}
              onClick={modal.primaryBtn.onClick || handleClose}
            >
              {modal.primaryBtn.title}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default LineNotifyArea;
