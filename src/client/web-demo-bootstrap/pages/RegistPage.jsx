import React from 'react';
import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import LoginForm from '../components/LoginForm';

const Registration = ({
  onSubmit = () => {},
  isSubmiting,
  hintMsg,
  errorMsg,
  onCancel,
}) => {
  return (
    <Container>
      <h1 className="text-center mt-5 mb-3">註冊會員</h1>
      {hintMsg && <Alert variant="secondary">{hintMsg}</Alert>}
      {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
      <Row className="justify-content-center">
        <Col md={9} lg={5}>
          <LoginForm
            onSubmit={onSubmit}
            isSubmiting={isSubmiting}
            buttonTitle="註冊"
            confirmPassword={true}
            onCancel={onCancel}
            cancelTitle="返回前頁"
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Registration;
