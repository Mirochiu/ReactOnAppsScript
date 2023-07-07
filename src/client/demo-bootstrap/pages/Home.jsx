import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import { serverFunctions } from '../../utils/serverFunctions';
import ProductList from '../components/ProductList';
import LineNotifyArea from '../components/LineNotifyArea';
import TinyPNGArea from '../components/TinyPNGArea';
import ImgurArea from '../components/ImgurArea';
import GoogleCalendarArea from '../components/GoogleCalendarArea';
import ChangeTriggerHourMinute from '../components/ChangeTriggerHourMinute';

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
      <TinyPNGArea>TinyPNG圖片壓縮</TinyPNGArea>
      <ChangeTriggerHourMinute></ChangeTriggerHourMinute>
      <LineNotifyArea>綁定LINE通知</LineNotifyArea>
      <ImgurArea>綁定Imgur</ImgurArea>
      <GoogleCalendarArea>授權讀取Google日曆</GoogleCalendarArea>

      <h1>產品列表</h1>
      <ProductList productData={productData} />
    </Container>
  );
};

export default Home;
