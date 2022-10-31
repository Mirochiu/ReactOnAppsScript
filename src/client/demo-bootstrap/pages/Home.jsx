import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { CSSTransition } from 'react-transition-group';
import { serverFunctions } from '../../utils/serverFunctions';

const Home = () => {
  const [showBtn, setShowBtn] = useState(true);
  const [showUrl, setShowUrl] = useState();

  const getServerUrl = () => {
    serverFunctions.getServerUrl().then(setShowUrl).catch(alert);
  };

  return (
    <Container>
      <p>
        <b>☀️ Bootstrap demo! ☀️</b>
      </p>
      <p>
        This is a sample app that uses the
        <code>react-bootstrap</code>
        library to help us build a simple React app.
      </p>
      {showBtn && (
        <Button
          className="border-0 mx-2"
          variant="primary"
          size="lg"
          onClick={getServerUrl}
        >
          Press Me
        </Button>
      )}
      <CSSTransition
        in={!!showUrl}
        timeout={300}
        classNames="alert"
        unmountOnExit
        onEnter={() => setShowBtn(false)}
        onExited={() => setShowBtn(true)}
      >
        <Alert variant="primary" dismissible onClose={() => setShowUrl('')}>
          <Alert.Heading>Animated alert message</Alert.Heading>
          <p>This alert message is being transitioned in and out of the DOM.</p>
          <p>Server URL:{showUrl}</p>
          <Button onClick={() => setShowUrl('')}>Close</Button>
        </Alert>
      </CSSTransition>
    </Container>
  );
};

export default Home;
