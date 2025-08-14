import React from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

const FileForm = ({
  onSubmit,
  isSubmiting,
  titleName = '檔案名稱',
  titleFile = '請選檔案',
  titleSubmit = '上傳',
  onNameChange = null,
  nameListId = null,
  acceptType = 'text/html',
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
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm={2}>
          {titleName}
        </Form.Label>
        <Col sm={10}>
          <Form.Control
            type="text"
            name="the-name"
            required={true}
            onChange={onNameChange}
            autoComplete="off"
            list={nameListId}
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm={2}>
          {titleFile}
        </Form.Label>
        <Col sm={10}>
          <Form.Control
            type="file"
            name="the-file"
            accept={acceptType}
            required={true}
          />
        </Col>
      </Form.Group>
      <Row className="mt-3 mb-3">
        <Col>
          <Button variant="primary" type="submit">
            {SpinnerWhen(isSubmiting)}
            {titleSubmit}
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

export default FileForm;
