import React from 'react';
import PropTypes from 'prop-types';
import { Form, Row, Col, Button, Spinner } from 'react-bootstrap';

const LoginForm = ({
  onSubmit,
  isSubmiting,
  buttonTitle,
  confirmPassword,
  lineLoginUrl,
  googleLoginUrl,
}) => {
  return (
    <Form onSubmit={onSubmit}>
      <Form.Group as={Row} className="mb-3" controlId="loginAccount">
        <Form.Label column sm={2}>
          帳號
        </Form.Label>
        <Col sm={10}>
          <Form.Control
            type="text"
            name="username"
            placeholder="輸入帳號(email)"
            autocomplete="username"
            required
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-3" controlId="loginPassword">
        <Form.Label column sm={2}>
          密碼
        </Form.Label>
        <Col sm={10}>
          <Form.Control
            type="password"
            name="password"
            placeholder="輸入密碼"
            autocomplete="current-password"
            required
          />
        </Col>
      </Form.Group>
      {confirmPassword && (
        <Form.Group as={Row} className="mb-3" controlId="confirmPassword">
          <Form.Label column sm={2}>
            確認密碼
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="password"
              name="confim-password"
              placeholder="輸入密碼"
              autocomplete="current-password"
              required
            />
          </Col>
        </Form.Group>
      )}
      <Row>
        <Button variant="primary" type="submit" disabled={isSubmiting}>
          {isSubmiting && (
            <Spinner as="span" animation="border" size="sm" role="status" />
          )}
          {buttonTitle}
        </Button>
      </Row>
      <Row>
        {lineLoginUrl && (
          <a href={lineLoginUrl} className="btn btn-success">
            以LINE登入
          </a>
        )}
      </Row>
      <Row>
        {googleLoginUrl && (
          <a href={googleLoginUrl} className="btn btn-outline-secondary">
            以Google登入
          </a>
        )}
      </Row>
    </Form>
  );
};

LoginForm.defaultProps = {
  buttonTitle: '登入',
  confirmPassword: false,
  lineLoginUrl: null,
  googleLoginUrl: null,
};

LoginForm.propTypes = {
  onSubmit: PropTypes.func,
  isSubmiting: PropTypes.bool,
  buttonTitle: PropTypes.string,
  confirmPassword: PropTypes.bool,
  lineLoginUrl: PropTypes.string,
  googleLoginUrl: PropTypes.string,
};

export default LoginForm;
