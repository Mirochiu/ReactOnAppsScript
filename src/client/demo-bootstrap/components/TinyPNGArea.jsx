import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useFilePicker } from 'use-file-picker';
import { serverFunctions } from '../../utils/serverFunctions';
import useAuth from '../hooks/useAuth';
import LoadingState from './LoadingState';
import MessagePanel from './MessagePanel';
import LocalStorage from '../utils/LocalStorage';

const IMG_STYLE = {
  maxWidth: '300px',
  maxHeight: '200px',
};

const ImageFilePicker = ({ onFilesSelected }) => {
  const [openFileSelector, { filesContent }] = useFilePicker({
    accept: ['.jpg', '.jpeg', '.png'],
    readAs: 'DataURL',
    onFilesSuccessfulySelected: onFilesSelected,
  });

  return (
    <div>
      <Button
        variant="outline-success"
        size="sm"
        onClick={() => openFileSelector()}
      >
        選圖上傳壓縮
      </Button>
      {filesContent.map((file, index) => (
        <div key={index}>
          <h2>{file.name}</h2>
          <img style={IMG_STYLE} alt={file.name} src={file.content} />
          <br />
        </div>
      ))}
    </div>
  );
};

const ImgLister = ({ list, onDeletion }) => {
  if (!Array.isArray(list)) return undefined;
  if (list.length === 0) return <p>沒有已上傳的圖像資料</p>;
  const supportDetele = typeof onDeletion === 'function';
  return (
    <table border="1">
      <thead>
        <tr>
          <th>名稱</th>
          <th>上傳時間</th>
          <th>預覽</th>
          {supportDetele && <th>刪除</th>}
        </tr>
      </thead>
      <tbody>
        {list.map((image, index) => {
          return (
            <tr key={`tr-${index}`}>
              <td>{image.name}</td>
              <td>{image.date}</td>
              <td>
                <a href={image.url} target="_blank" rel="noreferrer">
                  <img style={IMG_STYLE} src={image.url} alt={image.name} />
                </a>
              </td>
              {supportDetele && (
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    data-delete-hash={image.deletehash}
                    onClick={(e) => onDeletion(e.target.dataset.deleteHash)}
                  >
                    刪除
                  </Button>
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const readList = (uid) => {
  if (!uid) return [];
  try {
    const content = LocalStorage.getItem('[' + uid + '].tinypng.list');
    if (content) {
      const list = JSON.parse(content);
      if (Array.isArray(list)) return list.filter(Boolean);
    }
    return [];
  } catch (error) {
    return [];
  }
};

const addToList = (uid, item) => {
  if (!uid || typeof item !== 'object') return [];
  const list = readList(uid);
  list.push(item);
  LocalStorage.setItem('[' + uid + '].tinypng.list', JSON.stringify(list));
  return list;
};

const TinyPNGArea = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [isUploading, setUploading] = useState(null);
  const [newResponse, setNewResponse] = useState(null);
  const [alert, setAlert] = useState(null);
  const [imgList, setImgList] = useState(null);

  const { authed: uid, getToken } = useAuth();

  useEffect(() => {
    setUserToken(getToken());
  }, []);

  useEffect(() => {
    if (uid) {
      // console.debug('read', uid);
      try {
        setImgList(readList(uid));
      } catch (err) {
        setImgList(false);
      }
    }
  }, [uid]);

  useEffect(() => {
    if (uid && newResponse) {
      // console.debug('onNewResponse', newResponse, 'to', uid);
      setImgList(addToList(uid, newResponse));
    }
  }, [uid, newResponse]);

  const onFilesSelected = ({ filesContent }) => {
    // console.debug('onFilesSelected', filesContent[0].name);
    setUploading(true);
    serverFunctions
      .uploadToTinyPNG({
        name: filesContent[0].name,
        content: filesContent[0].content,
      })
      .then((response) => {
        setNewResponse(response);
        setAlert({
          type: 'normal',
          title: '成功',
          message: `圖片:${response.name}已上傳`,
          url: response.url,
        });
      })
      .catch((error) => {
        setAlert({
          type: 'error',
          title: '失敗',
          message: error.message + '\n' + error.stack,
        });
      })
      .finally(() => {
        setUploading(false);
      });
  };

  return (
    <LoadingState done={userToken !== null}>
      <Col>
        <Row className="h1">{children}</Row>
        <ImageFilePicker onFilesSelected={onFilesSelected} />
        <LoadingState done={isUploading !== true}></LoadingState>
        <MessagePanel msgObj={alert} onClose={() => setAlert(null)} />
        <ImgLister list={imgList} />
      </Col>
    </LoadingState>
  );
};

export default TinyPNGArea;
