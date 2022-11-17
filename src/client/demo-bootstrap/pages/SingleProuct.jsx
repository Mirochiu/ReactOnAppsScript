import React from 'react';
import { BsCartFill } from 'react-icons/bs';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ProductList, { AddCartBtn } from '../components/ProductList';
import { useEffect } from 'react';
import { useState } from 'react';
import { serverFunctions } from '../../utils/serverFunctions';

const RelatedProducts = [
  {
    imgUrl: 'https://dummyimage.com/450x300/dee2e6/6c757d.jpg',
    name: 'Fancy Product',
    priceList: [40, 50, 60, 70, 80],
  },
  {
    imgUrl: 'https://dummyimage.com/450x300/dee2e6/6c757d.jpg',
    name: 'Special Item',
    orgPrice: 20,
    price: 18,
    stars: 5,
  },
  {
    imgUrl: 'https://dummyimage.com/450x300/dee2e6/6c757d.jpg',
    name: 'Sale Item',
    orgPrice: 50,
    price: 25,
  },
  {
    imgUrl: 'https://dummyimage.com/450x300/dee2e6/6c757d.jpg',
    name: 'Popular Item',
    price: 40,
    starts: 4.5,
  },
];

const getProductDetails = ({ productId }) => ({
  id: productId,
  name: 'Shop item template',
  fullImgUrl: 'https://dummyimage.com/600x700/dee2e6/6c757d.jpg',
  orgPrice: 45,
  price: 40,
  detail: `所以說，現在，解決很棒的產品的問題，是非常非常重要的。 所以，很棒的產品，發生了會如何，不發生又會如何。
    所謂很棒的產品，關鍵是很棒的產品需要如何寫。很棒的產品真的是很值得探究，了解清楚很棒的產品到底是一種怎麽樣的存在，是解決一切問題的關鍵。
    我認為，而這些並不是完全重要，更加重要的問題是，本人也是經過了深思熟慮，在每個日日夜夜思考這個問題。既然是這樣，至於為什麼要思考很棒的產品呢？
    其實是有更深層的原因，要想清楚，很棒的產品，到底是一種怎麽樣的存在。`,
});

const PricePanel = ({ price, orgPrice, priceList }) => {
  if (Array.isArray(priceList)) {
    const Max = Math.max(...priceList);
    const Min = Math.min(...priceList);
    return `$${Min} - ${Max}`;
  }
  if (!price) return null;
  return (
    <>
      {orgPrice ? (
        <span className="text-decoration-line-through">{`$${orgPrice}`}</span>
      ) : null}
      {`$${price}`}
    </>
  );
};

// const ShowSpinnerWhen = ({ loadingVar }) => {
//   if (loadingVar == null) {
//     return <Spinner animation="border" size="lg" role="status" />;
//   }
//   if (loadingVar.length === 0) {
//     return <span className="text-center">還沒有設定產品</span>;
//   }
//   return loadingVar.map((data, idx) => (
//     <ProductCard key={`prodcuct-${idx}`} data={data} />
//   ));
// };

const SingleProduct = ({ productId }) => {
  const [prodcuct, setProductData] = useState({});

  useEffect(() => {
    let mounted = true;
    serverFunctions
      .getProductById(productId)
      .then((data) => {
        console.debug('single', data);
        if (mounted) setProductData(data);
      })
      .catch((err) => {
        console.error(err.message);
      });
    return () => {
      mounted = false;
    };
  }, [productId]);

  const {
    id,
    name,
    price,
    orgPrice,
    detail,
    fullImgUrl,
    fullImgAlt = '...',
  } = prodcuct;

  return (
    <>
      <section>
        <Container className="px-4 px-lg-5 my-5">
          <Row className="gx-4 gx-lg-5 align-items-center">
            <Col md={6}>
              <img
                className="card-img-top mb-5 mb-md-0"
                src={fullImgUrl}
                alt={fullImgAlt}
              />
            </Col>
            <Col md={6}>
              <div className="small mb-1">產品序號: {id}</div>
              <h1 className="display-5 fw-bolder">{name}</h1>
              <div className="fs-5 mb-5">
                <PricePanel orgPrice={orgPrice} price={price} />
              </div>
              <p className="lead">{detail}</p>
              <div className="d-flex">
                <input
                  className="form-control text-center me-3"
                  id="inputQuantity"
                  type="num"
                  value="1"
                  style={{ 'max-width': '3rem' }}
                />
                <AddCartBtn />
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <section className="py-2 bg-light">
        <Container className="px-4 px-lg-5 mt-5">
          <h2 className="fw-bolder mb-4">相關產品</h2>
          <ProductList productData={RelatedProducts}></ProductList>
        </Container>
      </section>
    </>
  );
};

export default SingleProduct;
