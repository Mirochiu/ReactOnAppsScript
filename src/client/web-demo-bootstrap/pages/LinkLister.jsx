import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { BsFillCloudUploadFill } from 'react-icons/bs';
import UploadHtml from './UploadHtml';
import { serverFunctions } from '../../utils/serverFunctions';

const NOTHINGTODO = () => {};

const LinkLister = () => {
  const [linkList, setlinkList] = useState(null);
  // TODO: check delete permission
  const [showDelete] = useState(true);
  const [showUploader, setUploader] = useState(false);

  useEffect(() => {
    let mounted = true;
    serverFunctions
      .getLinkList()
      .then((list) => {
        if (mounted) setlinkList(list);
      })
      .catch(alert);
    return () => {
      mounted = false;
    };
  }, []);

  const deleteLink = (e) => {
    e.preventDefault();
    const { name } = e.target;
    const item = e.target;
    serverFunctions
      .deleteContentFromSheet(name)
      .then((resp) => {
        if (resp.deleted && item) item.parentNode.remove();
      })
      .catch(NOTHINGTODO);
  };

  if (showUploader) {
    return (
      <UploadHtml
        goBack={(e) => {
          if (e) e.preventDefault();
          setUploader(false);
        }}
      />
    );
  }

  return (
    <Container>
      <h1>Sheet儲存的網頁</h1>
      <a
        className="float-end"
        href="#"
        onClick={(e) => {
          e.preventDefault();
          setUploader(true);
        }}
      >
        <BsFillCloudUploadFill />
        上傳網頁
      </a>
      {linkList && (
        <ul>
          {linkList.map((link, idx) => (
            <li key={idx}>
              <a href={link.url}>{link.name}</a>
              {showDelete && (
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={deleteLink}
                  name={link.name}
                >
                  刪除
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
};

export default LinkLister;
