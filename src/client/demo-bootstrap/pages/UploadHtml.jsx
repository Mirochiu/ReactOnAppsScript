import React, { useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import FileForm from '../components/FileForm';

import Server from '../../utils/server';

const { serverFunctions } = Server;

const UploadHtml = () => {
  const [msg, showText] = useState(null);
  const [link, setLink] = useState(null);

  const onSubmit = event => {
    event.preventDefault();
    showText('上傳中，請稍候...');
    serverFunctions
      .uploadHtmlFile(event.target)
      .then(response => {
        showText('上傳成功');
        setLink({
          url: response.url,
          title: response.name,
        });
      })
      .catch(error => {
        console.error(error);
        showText(`上傳失敗，錯誤訊息:${error.message}`);
      });
  };

  return (
    <Container>
      <h1>上傳HTML</h1>
      <FileForm titleName="網頁名稱" onSubmit={onSubmit} />
      <Row>{msg}</Row>
      {link && (
        <Row>
          <a href={link.url}>{link.title}</a>
        </Row>
      )}
    </Container>
  );
};

export default UploadHtml;
