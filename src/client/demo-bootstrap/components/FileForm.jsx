import React from 'react';
import PropTypes from 'prop-types';
import { Form, Row, Col, Button } from 'react-bootstrap';

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
      <Form.Group as={Row} className="mb-3" controlId="file_name">
        <Form.Label column sm={2}>
          {titleName}
        </Form.Label>
        <Col sm={10}>
          <Form.Control
            type="text"
            name="the-name"
            required="true"
            onChange={onNameChange}
            autocomplete="off"
            list={nameListId}
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-3" controlId="file_chooser">
        <Form.Label column sm={2}>
          {titleFile}
        </Form.Label>
        <Col sm={10}>
          <Form.Control
            type="file"
            name="the-file"
            accept="text/html"
            required="true"
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

FileForm.propTypes = {
  onSubmit: PropTypes.func,
  titleName: PropTypes.string,
  titleFile: PropTypes.string,
  titleSubmit: PropTypes.string,
  onNameChange: PropTypes.func,
  nameListId: PropTypes.string,
};

export default FileForm;
