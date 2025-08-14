import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import { serverFunctions } from '../../utils/serverFunctions';
import ProductList from '../components/ProductList';
import LineNotifyArea from '../components/LineNotifyArea';
import ImgurArea from '../components/ImgurArea';

const Home = () => {
  const [productData, setProductData] = useState(null);

  useEffect(() => {
    let mounted = true;
    serverFunctions
      .getAllProducts()
      .then((data) => {
        if (mounted) setProductData(data);
      })
      .catch((err) => {
        console.error(err.message);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Container>
      <LineNotifyArea>綁定LINE通知</LineNotifyArea>
      <ImgurArea>綁定Imgur</ImgurArea>

      <h1>產品列表</h1>
      <ProductList productData={productData} />
    </Container>
  );
};

export default Home;
