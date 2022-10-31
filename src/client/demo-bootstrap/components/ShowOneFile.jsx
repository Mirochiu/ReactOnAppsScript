import React from 'react';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

const ShowOneFile = ({ file }) => {
  return (
    <Col sm={6} md={4}>
      <div className="card p-5">
        <img
          className="card-img-top rounded bg-secondary bg-gradient"
          src={file.thumbnail ? file.thumbnail : undefined}
        />
        <div className="card-body">
          <p className="card-text">
            檔案名稱:{file.name}
            <br />
            檔案大小:{file.size}位元組
            <br />
          </p>
          <Button
            variant="primary"
            onClick={(e) => {
              e.preventDefault();
              window.top.location.href = file.url;
            }}
          >
            點此下載
          </Button>
        </div>
      </div>
    </Col>
  );
};

export default ShowOneFile;
