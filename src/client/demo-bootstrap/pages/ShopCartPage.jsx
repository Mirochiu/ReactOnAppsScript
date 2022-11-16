import React, { useState, useEffect } from 'react';
import { BsCartFill, BsPlus, BsDash } from 'react-icons/bs';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

const ProductsInCart = [
  {
    id: 11232,
    imgUrl: 'https://dummyimage.com/115x135/dee2e6/6c757d.png',
    name: 'iPhone 14 1TB Black',
    price: 27900,
    amount: 1,
  },
  {
    id: 190301,
    imgUrl: 'https://dummyimage.com/115x135/dee2e6/6c757d.png',
    name: 'iPhone 14 Case - Black',
    orgPrice: 320,
    price: 240,
    stars: 5,
    amount: 3,
  },
];

const PricePanel = ({ price, orgPrice }) => {
  if (!price) return null;
  return (
    <>
      {orgPrice ? (
        <span className="text-muted text-decoration-line-through">{`$${orgPrice}`}</span>
      ) : null}
      {` $${price}`}
    </>
  );
};

const ShowProduct = ({
  id,
  name,
  imgUrl,
  imgAlt = '...',
  price,
  orgPrice,
  amount,
  onAmountChange = () => {},
}) => {
  return (
    <div className="cart-item mb-2">
      <Row>
        <Col className="mx-auto">
          <img src={imgUrl} alt={imgAlt} />
        </Col>
        <Col>{name}</Col>
        <Col className="text-end">
          <PricePanel price={price} orgPrice={orgPrice} />
        </Col>
        <Col xs="8" md={4} lg={3} className="mb-3 ms-auto">
          <InputGroup>
            <Button
              variant="light"
              className="border-dark"
              onClick={() => onAmountChange({ id, change: 'minus' })}
            >
              <BsDash />
            </Button>
            <Form.Control
              readOnly={true}
              type="text"
              value={amount || 0}
              className="border-dark text-center"
            />
            <Button
              variant="light"
              className="border-dark"
              onClick={() => onAmountChange({ id, change: 'plus' })}
            >
              <BsPlus />
            </Button>
          </InputGroup>
        </Col>
      </Row>
    </div>
  );
};

const PRICE_INFO_INIT = {
  price: 0,
  tax: 0,
  total: 0,
};

const ShopCartPage = () => {
  const [itemList, setItemInCart] = useState(ProductsInCart);
  const [priceInfo, setPriceInfo] = useState(PRICE_INFO_INIT);

  const handleAmountChange = ({ id, change }) => {
    setItemInCart((prev) => {
      const targetIdx = prev.findIndex((obj) => obj.id === id);
      if (targetIdx === -1) {
        return prev; // not found target
      }

      const copyObj = { ...prev[targetIdx] }; // copy by spread operator
      switch (change) {
        case 'minus':
          if (copyObj.amount >= 1) copyObj.amount -= 1;
          break;
        case 'plus':
          copyObj.amount += 1;
          break;
        default:
      }

      return [
        ...prev.slice(0, targetIdx),
        copyObj,
        ...prev.slice(targetIdx + 1),
      ];
    });
  };

  useEffect(() => {
    const TAX = 0.5;

    const list = itemList;
    const price = list.reduce((acc, cur) => acc + cur.amount * cur.price, 0);
    const priceWithTax = Math.round(price * (1 + TAX) + 0.5);

    setPriceInfo({
      price,
      tax: priceWithTax - price,
      total: priceWithTax,
    });
  }, [itemList]);

  return (
    <Container className="px-4 px-lg-5 my-5">
      <h1 className="col-md-12 col-lg-10 fw-bolder mx-auto">我的購物清單</h1>
      <Row className="col-md-12 col-lg-10 mx-auto">
        {itemList.map((product, idx) => {
          const key = `prod-in-cart-${idx}`;
          return (
            <ShowProduct
              {...product}
              onAmountChange={handleAmountChange}
              key={key}
            />
          );
        })}
        <div className="cart-item">
          <Row>
            <Col xs={8}>
              <h5>商品總和: </h5>
              <h5>稅:</h5>
              <h5>總付款金額:</h5>
            </Col>
            <Col xs={4} className="text-end">
              <h5>${priceInfo.price}</h5>
              <h5>${priceInfo.tax}</h5>
              <h5>${priceInfo.total}</h5>
            </Col>
          </Row>
        </div>
        <Col md={12} className="pt-4 pb-4">
          <Button
            variant="success"
            className="d-flex float-end align-items-center"
          >
            <BsCartFill className="me-1" />
            結帳去
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default ShopCartPage;
