import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { BsFillCloudUploadFill } from 'react-icons/bs';
import ShowOneFile from '../components/ShowOneFile';
import UploadFile from './UploadFile';
import { serverFunctions } from '../../utils/serverFunctions';

const DirveLister = () => {
  const [fileList, setFileList] = useState([]);
  const [showUploader, setUploader] = useState(false);

  useEffect(() => {
    let mounted = true;
    serverFunctions
      .listFilesInDriveFolder()
      .then((list) => mounted && setFileList(list))
      .catch(alert);
    return () => {
      mounted = false;
    }
  }, []);

  if (showUploader) {
    return (
      <UploadFile
        goBack={(e) => {
          if (e) e.preventDefault();
          setUploader(false);
        }}
      />
    );
  }

  return (
    <Container>
      <h1>Drive檔案列表</h1>
      <Row>
        <a
          className="float-end"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setUploader(true);
          }}
        >
          <BsFillCloudUploadFill />
          上傳檔案
        </a>
      </Row>
      <Row>
        {fileList.map((file, idx) => (
          <ShowOneFile key={idx} file={file} />
        ))}
      </Row>
    </Container>
  );
};

export default DirveLister;
