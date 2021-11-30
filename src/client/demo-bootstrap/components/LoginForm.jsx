import React from 'react';
import PropTypes from 'prop-types';
import { Form, Row, Button, Spinner } from 'react-bootstrap';

const LoginForm = ({ onSubmit, isSubmiting, buttonTitle, confirmPassword}) => {
  return (
    <Form onSubmit={onSubmit}>
      <Form.Group className="form-floating" controlId="loginAccount">
        <Form.Control
          type="text"
          name="username"
          placeholder="輸入帳號(email)"
          autocomplete="username"
          required
        />
        <Form.Label>輸入帳號(email)</Form.Label>
      </Form.Group>
      <Form.Group className="form-floating" controlId="loginPassword">
        <Form.Control
          type="password"
          name="password"
          placeholder="輸入密碼"
          autocomplete="current-password"
          required
        />
        <Form.Label>輸入密碼</Form.Label>
      </Form.Group>
      {confirmPassword && (
        <Form.Group className="form-floating" controlId="confirmPassword">
          <Form.Control
            type="password"
            name="confim-password"
            placeholder="再次輸入密碼"
            autocomplete="current-password"
            required
          />
          <Form.Label>再次輸入密碼</Form.Label>
        </Form.Group>
      )}
      <Row className="mb-3" />
      <Button variant="primary" type="submit" disabled={isSubmiting}>
        {isSubmiting && (
          <Spinner as="span" animation="border" size="sm" role="status" />
        )}
        {buttonTitle}
      </Button>
    </Form>
  );
};

LoginForm.defaultProps = {
  buttonTitle: '登入',
  confirmPassword: false,
};

LoginForm.propTypes = {
  onSubmit: PropTypes.func,
  isSubmiting: PropTypes.bool,
  buttonTitle: PropTypes.string,
  confirmPassword: PropTypes.bool,
};

export default LoginForm;
