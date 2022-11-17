import React from 'react';
import { BsStarFill, BsStar, BsStarHalf, BsCartFill } from 'react-icons/bs';
import Badge from 'react-bootstrap/Badge';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';

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

export const AddCartBtn = () => {
  return (
    <div className="btn btn-outline-primary d-inline-flex justify-content-center align-items-center">
      <BsCartFill className="me-1" />
      <span className="d-none d-sm-block">加到購物車</span>
      <span className="d-sm-none">選購</span>
    </div>
  );
};

const OptionsBtn = ({ priceList }) => {
  return (
    <Dropdown as={ButtonGroup}>
      <Button variant="outline-primary">
        <span className="d-none d-sm-block">選擇價格</span>
        <span className="d-sm-none">選購</span>
      </Button>
      <Dropdown.Toggle split variant="outline-primary" />
      <Dropdown.Menu>
        {priceList.map((price, idx) => (
          <Dropdown.Item key={`price-list-${idx}`}>$ {price}</Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
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
        <Card.Footer className="p-4 pt-0 border-top-0 bg-transparent text-center">
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

const ShowSpinnerWhen = ({ loadingVar }) => {
  if (loadingVar == null) {
    return <Spinner animation="border" size="lg" role="status" />;
  }
  if (loadingVar.length === 0) {
    return <span className="text-center">還沒有設定產品</span>;
  }
  return loadingVar.map((data, idx) => (
    <ProductCard key={`prodcuct-${idx}`} data={data} />
  ));
};

const ProductList = ({ productData }) => {
  return (
    <Container className="px-4 px-lg-5 mt-5">
      <Row
        xs={1}
        sm={2}
        md={3}
        xl={4}
        className="gx-4 gx-lg-5 justify-content-center"
      >
        <ShowSpinnerWhen loadingVar={productData} />
      </Row>
    </Container>
  );
};

export default ProductList;
