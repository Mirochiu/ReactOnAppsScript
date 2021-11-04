import React from 'react';
import { Link } from 'react-router-dom';

const NoSuchPage = () => {
  return (
    <div>
      找不到頁面，
      <Link to="/home">按此回首頁</Link>
    </div>
  );
};

export default NoSuchPage;
