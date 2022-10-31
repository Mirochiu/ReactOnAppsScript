import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import ShowOneFile from '../components/ShowOneFile';
import { serverFunctions } from '../../utils/serverFunctions';

const DirveLister = () => {
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    serverFunctions.listFilesInDriveFolder().then(setFileList).catch(alert);
  }, []);

  return (
    <Container>
      <h1>Google Drive檔案列表</h1>
      <Row>
        {fileList.map((file, idx) => (
          <ShowOneFile key={idx} file={file} />
        ))}
      </Row>
    </Container>
  );
};

export default DirveLister;
