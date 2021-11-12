import React, { useState } from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import { Redirect, useHistory } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import useAuth from '../hooks/useAuth';

import Server from '../../utils/server';

const { serverFunctions } = Server;

const Registration = () => {
  const { authed } = useAuth();
  const history = useHistory();
  const [hint, showHint] = useState(null);
  const [submiting, setSubmit] = useState(null);

  const onSubmit = event => {
    event.preventDefault();
    setSubmit(true);
    showHint('註冊中...');
    serverFunctions
      .register(event.target)
      .then(response => {
        event.target.reset();
        showHint(response.message);
      })
      .catch(error => {
        console.error(error);
        showHint(error.message);
      })
      .finally(() => setSubmit(false));
  };

  const goBack = event => {
    event.preventDefault();
    history.goBack();
  };

  if (authed) return <Redirect to="/Home" replace />;

  return (
    <Container>
      <h1>註冊會員</h1>
      {hint && <Alert variant="secondary">{hint}</Alert>}
      <LoginForm
        onSubmit={onSubmit}
        isSubmiting={submiting}
        buttonTitle="註冊"
        confirmPassword={true}
      />
      <Row>
        <Col>
          <a className="text-secondary" href="#" onClick={goBack}>
            <small>返回前一頁</small>
          </a>
        </Col>
      </Row>
    </Container>
  );
};

export default Registration;
