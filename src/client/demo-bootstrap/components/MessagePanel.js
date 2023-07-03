import React from 'react';
import Alert from 'react-bootstrap/Alert';
import { CSSTransition } from 'react-transition-group';

const MessagePanel = ({ msgObj, onClose }) => {
  const type2variant = (type) => {
    if (type === 'error') {
      return 'danger';
    }
    return 'primary';
  };
  return (
    <CSSTransition in={!!msgObj} timeout={300} classNames="alert" unmountOnExit>
      <Alert variant={type2variant(msgObj?.type)} dismissible onClose={onClose}>
        <Alert.Heading>{msgObj?.title}</Alert.Heading>
        <p>{msgObj?.message}</p>
        {msgObj?.url && (
          <a href={msgObj.url} target="_blank" rel="noreferrer">
            連結
          </a>
        )}
      </Alert>
    </CSSTransition>
  );
};

export default MessagePanel;