import React, { useEffect, useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Server from '../../utils/server';

const { serverFunctions } = Server;

const ShowOneFile = ({ file }) => {
  return (
    <div className="col-12 col-sm-6 col-md-4">
      <div className="card p-5">
        <img
          className="card-img-top rounded bg-secondary bg-gradient"
          data-thumb={file.thumbnail}
        />
        <div className="card-body">
          <p className="card-text">
            檔案名稱:{file.name}
            <br />
            檔案大小:{file.size}位元組
            <br />
          </p>
          <a className="btn btn-primary" href={file.url}>
            點此下載
          </a>
        </div>
      </div>
    </div>
  );
};

ShowOneFile.propTypes = {
  file: PropTypes.object,
};

const DirveLister = () => {
  const [fileList, setFileList] = useState([]);

  const showDataThumbnails = () => {
    Array.from(document.getElementsByTagName('img')).forEach(e => {
      if (e.hasAttribute('data-thumb')) e.src = e.getAttribute('data-thumb');
    });
  };

  useEffect(() => {
    serverFunctions
      .listFilesInDriveFolder()
      .then(setFileList)
      .catch(alert)
      .then(showDataThumbnails);
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
