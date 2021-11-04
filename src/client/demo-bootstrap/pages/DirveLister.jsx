import React, { useEffect, useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import ShowOneFile from '../components/ShowOneFile';
import Server from '../../utils/server';

const { serverFunctions } = Server;

const DirveLister = () => {
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    serverFunctions
      .listFilesInDriveFolder()
      .then(setFileList)
      .catch(alert);
  }, []);

  return (
    <Container>
      <h1>Google Drive檔案列表</h1>
      <Row>
        {fileList.map((file, idx) =>
          <ShowOneFile key={idx} file={file} />
        )}
      </Row>
    </Container>
  );
};

export default DirveLister;
