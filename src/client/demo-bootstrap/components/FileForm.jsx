import React from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';

const FileForm = ({
  onSubmit,
  titleName = '檔案名稱',
  titleFile = '請選檔案',
  titleSubmit = '上傳',
  onNameChange = null,
  nameListId = null,
}) => {
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
            accept="text/html"
            required={true}
          />
        </Col>
      </Form.Group>
      <Row>
        <Button variant="primary" type="submit">
          {titleSubmit}
        </Button>
      </Row>
    </Form>
  );
};

export default FileForm;
