import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { useFilePicker } from 'use-file-picker';
import { serverFunctions } from '../../utils/serverFunctions';
import useAuth from '../hooks/useAuth';
import LoadingState from './LoadingState';
import MessagePanel from './MessagePanel';
import ImgurButton from './ImgurButton';

const IMG_STYLE = {
  maxWidth: '300px',
  maxHeight: '200px',
};

const listImgur = async (token) => {
  const rsp = await fetch('https://api.imgur.com/3/account/me/images', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!rsp.ok)
    throw new Error(`rejected, code:${rsp.status}, msg:${rsp.statusText}`);
  const json = await rsp.json();
  return json.data.map((image) => ({
    id: image.id,
    deletehash: image.deletehash,
    url: image.link,
    datetime: image.datetime,
  }));
};

const uplodToImgur = async (token, file) => {
  if (!(file instanceof File) && !(file instanceof Blob))
    throw new Error('not Blob or Flle');

  const formData = new FormData();
  formData.append('image', file);

  const rsp = await fetch('https://api.imgur.com/3/image', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  if (!rsp.ok)
    throw new Error(`rejected, code:${rsp.status}, msg:${rsp.statusText}`);
  const json = await rsp.json();
  return {
    name: file.name,
    size: file.size,
    url: json.data.link,
    deletehash: json.data.deletehash,
    datetime: json.data.datetime,
  };
};

const deleteFromImgur = async (token, deletehash) => {
  const rsp = await fetch('https://api.imgur.com/3/image/' + deletehash, {
    method: 'DELETE',
    headers: {
      Authorization: 'Bearer ' + token,
    },
  });
  if (!rsp.ok)
    throw new Error(`rejected, code:${rsp.status}, msg:${rsp.statusText}`);
  const json = await rsp.json();
  return json;
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
        選圖上傳
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
  if (list.length === 0) return <p>沒有圖像資料</p>;
  const supportDetele = typeof onDeletion === 'function';
  return (
    <table border="1">
      <thead>
        <tr>
          <th>Imgur ID</th>
          <th>預覽</th>
          {supportDetele && <th>刪除</th>}
        </tr>
      </thead>
      <tbody>
        {list.map((image, index) => {
          return (
            <tr key={`tr-${index}`}>
              <td>{image.id}</td>
              <td>
                <a href={image.url} target="_blank" rel="noreferrer">
                  <img style={IMG_STYLE} src={image.url} alt={image.id} />
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

const ImgurArea = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [bindToken, setBindToken] = useState(null);
  const [alert, setAlert] = useState(null);
  const [imgList, setImgList] = useState(null);
  const [reloadList, reloadImgList] = useState(false);
  const [imgDelHash, setImgDel] = useState(false);

  const { getToken } = useAuth();

  useEffect(() => {
    setUserToken(getToken());
  }, []);

  useEffect(() => {
    if (userToken) {
      serverFunctions
        .getImgurToken(userToken)
        .then((token) => {
          // console.debug('getImgurToken', token);
          setBindToken(token);
        })
        .catch(({ message }) => {
          console.error('getImgurToken', message);
          setBindToken(false);
        });
    }
  }, [userToken]);

  useEffect(() => {
    if (bindToken) {
      listImgur(bindToken).then((list) => {
        // console.debug('listImgur', list);
        setImgList(list);
      });
    }
  }, [bindToken, reloadList]);

  useEffect(() => {
    if (bindToken && imgDelHash)
      // console.debug('deleteFromImgur', bindToken, imgDelHash);
      deleteFromImgur(bindToken, imgDelHash)
        .then((_) => reloadImgList((v) => !v))
        .catch(({ message }) => {
          console.error('deleteFromImgur', message);
          setAlert({
            type: 'error',
            title: '錯誤',
            message,
          });
        });
  }, [bindToken, imgDelHash]);

  const onFilesSelected = ({ plainFiles }) => {
    uplodToImgur(bindToken, plainFiles[0])
      .then((resp) => {
        // console.debug(resp);
        setAlert({
          type: 'normal',
          title: '成功',
          message: `圖片:${resp.name}已上傳`,
          url: resp.url,
        });
        reloadImgList((v) => !v);
      })
      .catch(({ message }) => {
        console.error('uplodToImgur', message);
        setAlert({
          type: 'error',
          title: '錯誤',
          message,
        });
      });
  };

  return (
    <LoadingState done={bindToken !== null}>
      {bindToken ? (
        <div>
          <h1>Imgur圖集</h1>
          <ImageFilePicker onFilesSelected={onFilesSelected} />
          <MessagePanel msgObj={alert} onClose={() => setAlert(null)} />
          <ImgLister list={imgList} onDeletion={(hash) => setImgDel(hash)} />
        </div>
      ) : (
        <ImgurButton userToken={userToken}>{children}</ImgurButton>
      )}
    </LoadingState>
  );
};

export default ImgurArea;
