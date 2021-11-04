import React from 'react';
import PropTypes from 'prop-types';

const ShowOneFile = ({ file }) => {
  return (
    <div className="col-12 col-sm-6 col-md-4">
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

export default ShowOneFile;
