import React from 'react';
import Badge from 'react-bootstrap/Badge';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import LoadingState from './LoadingState';
import PricePanel from './PricePanel';
import ShowStars from './ShowStars';
import AddCartBtn from './AddCartBtn';

const RightTopBadge = ({ text = '特價' }) => {
  return (
    <Badge
      bg="primary"
      className="position-absolute"
      style={{ top: '0.5rem', right: '0.5rem' }}
    >
      {text}
    </Badge>
  );
};

const ProductCard = ({ data }) => {
  const {
    id,
    imgUrl,
    name,
    price,
    orgPrice,
    priceList,
    imgAlt = '...',
    stars,
  } = data;
  return (
    <Col className="mb-5">
      <Card className="h-100">
        {price && orgPrice > price ? <RightTopBadge /> : null}
        <Card.Img variant="top" src={imgUrl} alt={imgAlt} />
        <Card.Body className="p-4">
          <div className="text-center">
            <h5 className="fw-bolder">{name}</h5>
            <ShowStars stars={stars} />
            <PricePanel
              priceList={priceList}
              price={price}
              orgPrice={orgPrice}
            />
          </div>
        </Card.Body>
        <Card.Footer className="p-4 pt-0 border-top-0 bg-transparent text-center">
          <AddCartBtn priceList={priceList} productId={id} />
        </Card.Footer>
      </Card>
    </Col>
  );
};

const ProductList = ({ list }) => {
  if (!Array.isArray(list)) return null;
  if (list.length === 0) {
    return <span className="text-center">還沒有設定產品</span>;
  }
  return (
    <Row
      xs={1}
      sm={2}
      md={3}
      xl={4}
      className="gx-4 gx-lg-5 justify-content-center"
    >
      {list.map((data, idx) => (
        <ProductCard key={`prodcuct-${idx}`} data={data} />
      ))}
    </Row>
  );
};

const ProductListContainer = ({ productData }) => {
  return (
    <Container className="px-4 px-lg-5 mt-5 text-center">
      <LoadingState done={productData}>
        <ProductList list={productData} />
      </LoadingState>
    </Container>
  );
};

export default ProductListContainer;
