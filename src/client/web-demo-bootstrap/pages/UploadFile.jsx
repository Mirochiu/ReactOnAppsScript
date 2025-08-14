import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import FileForm from '../components/FileForm';
import { serverFunctions } from '../../utils/serverFunctions';

const UploadFile = ({ goBack = () => {} }) => {
  const [msg, showText] = useState(null);
  const [link, setLink] = useState(null);
  const [isUploading, setUploading] = useState(false);

  // do not convert to arrow function
  function onDataUrl(data) {
    serverFunctions
      .uploadImageFile(data)
      .then((response) => {
        showText('上傳成功');
        setLink({
          url: response.url,
          title: response.name,
          thumbnail: response.thumbnail,
        });
      })
      .catch((error) => {
        showText(`上傳失敗，錯誤訊息:${error.message}`);
      })
      .finally(() => {
        setUploading(false);
      });
  }

  const onSubmit = (event) => {
    event.preventDefault();
    setUploading(true);
    showText('上傳中，請稍候...');
    try {
      const form = event.target;
      const name = form['the-name'].value;
      const file = form['the-file'].files[0];
      const reader = new FileReader();
      reader.addEventListener('error', (err) => {
        throw err;
      });
      // eslint-disable-next-line func-names
      reader.addEventListener('load', function () {
        onDataUrl({
          'the-name': name,
          'the-data': this.result,
        });
      });
      reader.readAsDataURL(file);
    } catch (error) {
      showText(`上傳失敗，錯誤訊息:${error.message}`);
      setUploading(false);
    }
  };

  const getDownloadHandler = (url) => (e) => {
    e.preventDefault();
    window.top.location.href = url;
  };

  return (
    <Container>
      <h1>上傳檔案</h1>
      <FileForm
        titleName="檔案名稱"
        onSubmit={onSubmit}
        acceptType="image/*"
        isSubmiting={isUploading}
        cancelTitle={link ? '返回' : '取消'}
        onCancel={goBack}
      />
      <Row>{msg}</Row>
      {link && (
        <Row>
          上傳完成! 點擊連結可下載檔案
          <a href="#" onClick={getDownloadHandler(link.url)}>
            {link.title}
            {link.thumbnail ? (
              <img width="100%" src={link.thumbnail} alt={link.title} />
            ) : null}
          </a>
        </Row>
      )}
    </Container>
  );
};

export default UploadFile;
