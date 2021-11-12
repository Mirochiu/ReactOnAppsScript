import React, { useState } from 'react';
import { Container, Row, Alert, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import useAuth from '../hooks/useAuth';

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
      <LoginForm onSubmit={onSubmit} isSubmiting={submiting} />
      <Row>
        <Link to="/register" className="text-secondary">
          <small>註冊會員</small>
        </Link>
      </Row>
    </Container>
  );
};

export default Login;
