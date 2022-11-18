import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ProductList from '../components/ProductList';
import { serverFunctions } from '../../utils/serverFunctions';
import LoadingState from '../components/LoadingState';
import ChangableAmount from '../components/ChangableAmount';
import PricePanel from '../components/PricePanel';
import ShowStars from '../components/ShowStars';
import AddCartBtn from '../components/AddCartBtn';

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

const SingleProduct = ({ productId }) => {
  const [productData, setProductData] = useState(null);
  const [orderAmount, setOrderAmount] = useState(1);

  useEffect(() => {
    let mounted = true;
    serverFunctions
      .getProductById(productId)
      .then((data) => {
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
    stars,
    fullImgUrl,
    fullImgAlt = '...',
  } = productData || {};

  return (
    <div className="px-4 px-lg-5 my-5">
      <Row className="gx-4 gx-lg-5 align-items-center">
        <Col md={6}>
          <LoadingState done={productData}>
            <img
              className="card-img-top mb-5 mb-md-0"
              src={fullImgUrl}
              alt={fullImgAlt}
            />
          </LoadingState>
        </Col>
        <Col md={6}>
          <div className="small mb-1">產品序號: {id || productId}</div>
          <h1 className="display-5 fw-bolder">
            <LoadingState done={productData}>{name}</LoadingState>
          </h1>
          <div className="fs-5 mb-5">
            <LoadingState done={productData}>
              {stars ? (
                <p>
                  用戶評價:
                  <ShowStars stars={stars} />
                </p>
              ) : null}
              <PricePanel orgPrice={orgPrice} price={price} />
            </LoadingState>
          </div>
          <p className="lead">
            <LoadingState done={productData}>{detail}</LoadingState>
          </p>
          <Row>
            <Col>
              <ChangableAmount
                amount={orderAmount}
                onIncrement={() => setOrderAmount((v) => v + 1)}
                onDecrement={() => setOrderAmount((v) => (v <= 1 ? 1 : v - 1))}
              />
            </Col>
            <Col>
              <AddCartBtn
                productId={id}
                amount={orderAmount}
                onClickDone={() => setOrderAmount(1)}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

const SingleProductPage = ({ productId }) => {
  return (
    <Container>
      <SingleProduct productId={productId} />
      <section className="py-2 bg-light">
        <div className="px-4 px-lg-5 mt-5">
          <h2 className="fw-bolder mb-4">相關產品</h2>
          <ProductList productData={RelatedProducts}></ProductList>
        </div>
      </section>
    </Container>
  );
};

export default SingleProductPage;
