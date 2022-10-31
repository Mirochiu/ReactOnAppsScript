import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { serverFunctions } from '../../utils/serverFunctions';

const NOTHINGTODO = () => {};

const LinkLister = () => {
  const [linkList, setlinkList] = useState(null);
  // TODO: check delete permission
  const [showDelete] = useState(true);

  useEffect(() => {
    serverFunctions.getLinkList().then(setlinkList).catch(alert);
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

  return (
    <Container>
      <h1>Sheet儲存的網頁</h1>
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
