import React from 'react';
import Stack from 'react-bootstrap/Stack';
import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import LoginForm from '../components/LoginForm';
import {
  GoogleLoginButton,
  LineLoginButton,
} from '../components/OAuthLoginButtons';

const LoginPage = ({
  onSubmit = () => {},
  isSubmiting,
  hintMsg,
  errorMsg,
  goRegist,
}) => {
  return (
    <Container>
      <h1 className="text-center mt-5 mb-3">React on Apps Script</h1>
      {hintMsg && <Alert variant="secondary">{hintMsg}</Alert>}
      {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
      <Row className="justify-content-center">
        <Col md={9} lg={5}>
          <LoginForm
            onSubmit={onSubmit}
            isSubmiting={isSubmiting}
            onCancel={goRegist}
            cancelTitle="註冊會員"
          />
          <Stack gap={2}>
            <Row>
              <Col>
                <hr />
              </Col>
              <Col className="text-center">或是免註冊登入</Col>
              <Col>
                <hr />
              </Col>
            </Row>
            <LineLoginButton>以LINE登入</LineLoginButton>
            <GoogleLoginButton>以Google登入</GoogleLoginButton>
          </Stack>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
