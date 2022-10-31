import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import FileForm from '../components/FileForm';
import { serverFunctions } from '../../utils/serverFunctions';

const ID_UPLOAD_NAME_CANDIDATES = 'html-name-candidates';

const UploadHtml = () => {
  const [msg, showText] = useState(null);
  const [link, setLink] = useState(null);
  const [name, setName] = useState('');
  const [nameCandidates, setCandidate] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      serverFunctions
        .searchByNameInUploadedHtml(name)
        .then((response) => {
          setCandidate(response);
        })
        .catch((error) => {
          showText(`上傳失敗，錯誤訊息:${error.message}`);
        });
    }, 300);
    return () => clearTimeout(timer);
  }, [name]);

  const onSubmit = (event) => {
    event.preventDefault();
    showText('上傳中，請稍候...');
    serverFunctions
      .uploadHtmlFile(event.target)
      .then((response) => {
        showText('上傳成功');
        setLink({
          url: response.url,
          title: response.name,
        });
      })
      .catch((error) => {
        showText(`上傳失敗，錯誤訊息:${error.message}`);
      });
  };

  return (
    <Container>
      <h1>上傳HTML</h1>
      <FileForm
        titleName="網頁名稱"
        onSubmit={onSubmit}
        onNameChange={({ target }) => setName(target.value)}
        nameListId={
          nameCandidates.length > 0 ? ID_UPLOAD_NAME_CANDIDATES : null
        }
      />
      {nameCandidates.length > 0 && (
        <datalist id={ID_UPLOAD_NAME_CANDIDATES}>
          {nameCandidates.map((nameSuggestion, idx) => (
            <option value={nameSuggestion} key={`nameSuggestion-${idx}`} />
          ))}
        </datalist>
      )}
      <Row>{msg}</Row>
      {link && (
        <Row>
          上傳完成! 點擊以下連結可查看上傳完成的HTML
          <a href={link.url}>{link.title}</a>
        </Row>
      )}
    </Container>
  );
};

export default UploadHtml;
