import React, { useState, useEffect } from 'react';
import { Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import LoginForm from '../components/LoginForm';

import Server from '../../utils/server';

const { serverFunctions } = Server;

const LoginState = {
  havnt: -2,
  error: -1,
  unknown: 0,
  logined: 1,
};

const Login = () => {
  const [loginState, setLoginState] = useState(LoginState.unknown);
  const [msg, showText] = useState(null);
  const [link, showLink] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('user-token');
    serverFunctions
      .authLogin(token)
      .then(() => {
        setLoginState(LoginState.logined);
        showText('您已登入');
        showLink(true);
      })
      .catch(error => {
        console.warn(error, token);
        setLoginState(LoginState.havnt);
      });
  }, []);

  const onSubmit = event => {
    event.preventDefault();
    showText('登入中，請稍候...');
    serverFunctions
      .loginUser(event.target)
      .then(response => {
        setLoginState(LoginState.logined);
        localStorage.setItem('user-token', response.token);
        showText(response.message);
        showLink(true);
      })
      .catch(error => {
        console.error(error);
        setLoginState(LoginState.error);
        showText(`登入失敗，錯誤訊息:${error.message}`);
      });
  };

  return (
    <Container>
      <h1>登入</h1>
      {loginState < 0 && <LoginForm onSubmit={onSubmit} />}
      <Row>{msg}</Row>
      {link && <Link to="/home">點此前往首頁</Link>}
    </Container>
  );
};

export default Login;
