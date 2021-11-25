import React, { useState } from 'react';
import { Container, Row, Col, Alert, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import useAuth from '../hooks/useAuth';

const getLineLoginURL = () => {
  const LINE_AUTH_URL = 'https://access.line.me/oauth2/v2.1/authorize';
  const SCOPE = 'profile%20openid';
  const CHANNEL_ID = process.env.LINE_CHANNEL_ID;
  const CALLBACK_URL = process.env.SERVER_URL;
  const STATE = process.env.LINE_STATE;
  const NONCE = process.env.LINE_NONCE;
  return `${LINE_AUTH_URL}?response_type=code&client_id=${CHANNEL_ID}&redirect_uri=${CALLBACK_URL}&state=${STATE}&scope=${SCOPE}&nonce=${NONCE}`;
};

const getGoogleLoginURL = () => {
  const AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
  const SCOPE =
    'https://www.googleapis.com/auth/userinfo.email%20https://www.googleapis.com/auth/userinfo.profile%20openid';
  const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const CALLBACK_URL = process.env.SERVER_URL;
  const STATE = process.env.GOOGLE_STATE;
  const NONCE = process.env.GOOGLE_NONCE;
  return `${AUTH_URL}?access_type=offline&include_granted_scopes=true&response_type=code&client_id=${CLIENT_ID}&redirect_uri=${CALLBACK_URL}&state=${STATE}&scope=${SCOPE}&nonce=${NONCE}`;
};

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
      <Row className="justify-content-center">
        <Col md="6" lg="5">
          <h1>登入</h1>
        </Col>
      </Row>
      {hint && <Alert variant="secondary">{hint}</Alert>}
      <Row className="justify-content-center">
        <Col md="6" lg="5">
          <LoginForm
            onSubmit={onSubmit}
            isSubmiting={submiting}
            lineLoginUrl={getLineLoginURL()}
            googleLoginUrl={getGoogleLoginURL()}
          />
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="6" lg="5">
          <Link to="/register" className="text-decoration-none text-secondary">
            註冊會員
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
