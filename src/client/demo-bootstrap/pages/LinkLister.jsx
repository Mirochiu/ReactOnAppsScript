import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import Server from '../../utils/server';

const { serverFunctions } = Server;

const LinkLister = () => {
  const [linkList, setlinkList] = useState(null);

  useEffect(() => {
    serverFunctions
      .getLinkList()
      .then(setlinkList)
      .catch(alert);
  }, []);

  return (
    <Container>
      <h1>Sheet儲存的網頁</h1>
      {linkList && (
        <ul>
          {linkList.map((link, idx) => (
            <li key={idx}>
              <a href={link.url}>{link.name}</a>
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
};

export default LinkLister;
