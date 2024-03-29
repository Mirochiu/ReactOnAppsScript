import React from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import InputGroup from 'react-bootstrap/InputGroup';
import { FaUnlock, FaUnlockAlt } from 'react-icons/fa';
import { MdContactMail } from 'react-icons/md';

const LoginForm = ({
  onSubmit,
  isSubmiting,
  buttonTitle = '登入',
  confirmPassword = false,
  cancelTitle = '取消',
  onCancel,
}) => {
  const SpinnerWhen = (show) => {
    if (show)
      return <Spinner as="span" animation="border" size="sm" role="status" />;
    return undefined;
  };
  return (
    <Form onSubmit={onSubmit}>
      <Row className="mb-3">
        <InputGroup>
          <InputGroup.Text>
            <MdContactMail />
          </InputGroup.Text>
          <Form.Floating>
            <Form.Control
              type="text"
              name="username"
              placeholder="輸入帳號(email)"
              autoComplete="username"
              required={true}
            />
            <Form.Label>輸入帳號(email)</Form.Label>
          </Form.Floating>
        </InputGroup>
      </Row>
      <Row className="mb-3">
        <InputGroup>
          <InputGroup.Text>
            <FaUnlock />
          </InputGroup.Text>
          <Form.Floating>
            <Form.Control
              type="password"
              name="password"
              placeholder="輸入密碼"
              autoComplete="current-password"
              required={true}
            />
            <Form.Label>輸入密碼</Form.Label>
          </Form.Floating>
        </InputGroup>
      </Row>
      {confirmPassword && (
        <Row className="mb-3">
          <InputGroup>
            <InputGroup.Text>
              <FaUnlockAlt />
            </InputGroup.Text>
            <Form.Floating>
              <Form.Control
                type="password"
                name="confim-password"
                placeholder="再次輸入密碼"
                autoComplete="current-password"
                required={true}
              />
              <Form.Label>再次輸入密碼</Form.Label>
            </Form.Floating>
          </InputGroup>
        </Row>
      )}
      <Row className="mt-3 mb-3">
        <Col>
          <Button variant="primary" disabled={isSubmiting} type="submit">
            {SpinnerWhen(isSubmiting)}
            {buttonTitle}
          </Button>
          {onCancel && (
            <Button
              variant="outline-secondary"
              className="float-end"
              disabled={isSubmiting}
              onClick={onCancel}
            >
              {cancelTitle}
            </Button>
          )}
        </Col>
      </Row>
    </Form>
  );
};

export default LoginForm;
