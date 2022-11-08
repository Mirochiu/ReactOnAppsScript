import React from 'react';
import { BsStarFill, BsStar, BsStarHalf, BsCartFill } from 'react-icons/bs';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

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

const ProductBtn = ({ title, children }) => {
  return (
    <div className="text-center">
      <Button variant="outline-primary">
        {children}
        {title}
      </Button>
    </div>
  );
};

const AddCartBtn = (props) => {
  return (
    <ProductBtn {...props} title="加到購物車">
      <BsCartFill />
    </ProductBtn>
  );
};

const OptionsBtn = (props) => {
  return <ProductBtn {...props} title="選擇價格" />;
};

const ShowStars = ({ stars }) => {
  if (!stars) return null;
  return (
    <div className="d-flex justify-content-center small text-warning mb-2">
      {[0, 1, 2, 3, 4].map((lv, idx) => {
        const d = stars - lv;
        const k = `star-${idx}`;
        if (d >= 1) return <BsStarFill key={k} />;
        if (d >= 0.5) return <BsStarHalf key={k} />;
        return <BsStar key={k} />;
      })}
    </div>
  );
};

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
        <span className="text-muted text-decoration-line-through">{`$${orgPrice}`}</span>
      ) : null}
      {`$${price}`}
    </>
  );
};

const ProductCard = ({ data }) => {
  const {
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
        <Card.Footer className="p-4 pt-0 border-top-0 bg-transparent">
          {Array.isArray(priceList) ? (
            <OptionsBtn priceList={priceList} />
          ) : (
            <AddCartBtn />
          )}
        </Card.Footer>
      </Card>
    </Col>
  );
};

const ProductList = ({ productData }) => {
  return (
    <Container className="px-4 px-lg-5 mt-5">
      <Row xs={2} md={3} xl={4} className="gx-4 gx-lg-5 justify-content-center">
        {productData.map((data, idx) => (
          <ProductCard key={`prodcuct-${idx}`} data={data} />
        ))}
      </Row>
    </Container>
  );
};

export default ProductList;
