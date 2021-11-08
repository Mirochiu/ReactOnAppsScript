import React, { useEffect, useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import Server from '../../utils/server';

const { serverFunctions } = Server;

const LinkLister = () => {
  const [linkList, setlinkList] = useState(null);
  const [showDelete, hasDeletePermission] = useState(false);

  useEffect(() => {
    serverFunctions
      .getLinkList()
      .then(setlinkList)
      .catch(alert);
    const token = localStorage.getItem('user-token');
    serverFunctions.authLogin(token).then(() => hasDeletePermission(true));
  }, []);

  const deleteLink = event => {
    event.preventDefault();
    const { name } = event.target;
    const element = event.target;
    serverFunctions.deleteContentFromSheet(name).then(response => {
      if (response.deleted && element) element.parentNode.remove();
    });
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
