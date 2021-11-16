import React, { useState } from 'react';
import { Container, Row, Alert, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import useAuth from '../hooks/useAuth';

const LINE_AUTH_URL = 'https://access.line.me/oauth2/v2.1/authorize';
const CHANNEL_ID = process.env.LINE_CHANNEL_ID;
const CALLBACK_URL = process.env.SERVER_URL;
const STATE = process.env.LINE_STATE;
const NONCE = process.env.LINE_NONCE;
const LINE_LOGIN_URL = `${LINE_AUTH_URL}?response_type=code&client_id=${CHANNEL_ID}&redirect_uri=${CALLBACK_URL}&state=${STATE}&scope=profile%20openid&nonce=${NONCE}`;

const Login = () => {
  const { authed, login, logout } = useAuth();
  const [msg, showText] = useState(null);
  const [submiting, setSubmit] = useState(null);
  const location = useLocation();

  const onSubmit = event => {
    event.preventDefault();
    setSubmit(true);
    showText('登入中，請稍候...');
    login(event.target)
      .catch(error => {
        console.warn(error);
        showText(error.message);
      })
      .finally(() => setSubmit(false));
  };

  const onLogout = () => {
    logout();
    showText(null);
  };

  if (authed) {
    return (
      <Container>
        <h1>您已登入</h1>
        <Row>
          <Button onClick={onLogout} variant="secondary">
            登出
          </Button>
        </Row>
        <Row>
          <Link to="/home">點此前往首頁</Link>
        </Row>
      </Container>
    );
  }

  const hint = msg || location?.state?.message;

  return (
    <Container>
      <h1>登入</h1>
      {hint && <Alert variant="secondary">{hint}</Alert>}
      <LoginForm
        onSubmit={onSubmit}
        isSubmiting={submiting}
        lineLoginUrl={LINE_LOGIN_URL}
      />
      <Row>
        <Link to="/register" className="text-secondary">
          <small>註冊會員</small>
        </Link>
      </Row>
    </Container>
  );
};

export default Login;
