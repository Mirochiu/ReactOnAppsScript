import React, { useState, useEffect } from 'react';
import { BsCartFill } from 'react-icons/bs';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ChangableAmount from '../components/ChangableAmount';
import PricePanel from '../components/PricePanel';
import useCart from '../hooks/useCart';
import { serverFunctions } from '../../utils/serverFunctions';
import LoadingState from '../components/LoadingState';

const ProductInCart = ({
  product,
  onIncrement = () => {},
  onDecrement = () => {},
}) => {
  const {
    name,
    thumbnailUrl,
    imgAlt = '...',
    price,
    orgPrice,
    amount,
    option,
  } = product;
  return (
    <div className="cart-item mb-2">
      <Row>
        <Col className="mx-auto">
          <img src={thumbnailUrl} alt={imgAlt} />
        </Col>
        <Col>{name}</Col>
        <Col className="text-end">
          <PricePanel price={price || option} orgPrice={orgPrice} />
        </Col>
        <Col xs="8" md={4} lg={3} className="mb-3 ms-auto">
          <ChangableAmount
            amount={amount}
            onIncrement={() => onIncrement({ target: product })}
            onDecrement={() => onDecrement({ target: product })}
          />
        </Col>
      </Row>
    </div>
  );
};

const ChartList = ({ list, onAmountChange }) => {
  if (!Array.isArray(list)) return null;
  return list.map((product, idx) => (
    <ProductInCart
      key={`prod-in-cart-${idx}`}
      product={product}
      onIncrement={(e) => onAmountChange({ ...e, change: 'plus' })}
      onDecrement={(e) => onAmountChange({ ...e, change: 'minus' })}
    />
  ));
};

const ShopCartPage = () => {
  const { cartList, add, remove } = useCart();
  const [itemList, setItemInCart] = useState(null);
  const [priceInfo, setPriceInfo] = useState(null);

  useEffect(() => {
    let mounted = true;
    if (!cartList) {
      setItemInCart([]);
      return () => {};
    }
    Promise.all(
      cartList.map((ordered) =>
        serverFunctions.getProductById(ordered.id).then((data) => {
          return {
            ...data,
            option: ordered.option,
            amount: ordered.amount,
          };
        })
      )
    )
      .then((results) => {
        if (mounted) setItemInCart(results);
      })
      .catch((err) => console.error(err.message));
    return () => {
      mounted = false;
    };
  }, [cartList]);

  useEffect(() => {
    if (!itemList) {
      setPriceInfo(null);
      return;
    }
    const TAX = 0.05;
    const price = itemList.reduce(
      (acc, cur) => acc + cur.amount * (cur.price || cur.option),
      0
    );
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
        <LoadingState done={itemList}>
          <ChartList
            list={itemList}
            onAmountChange={({ target, change }) => {
              if (change === 'minus') remove(target.id, 1, target.option);
              else if (change === 'plus') add(target.id, 1, target.option);
            }}
          />
        </LoadingState>
        <div className="cart-item">
          <Row>
            <Col xs={8}>
              <h5>商品總和: </h5>
              <h5>稅:</h5>
              <h5>總付款金額:</h5>
            </Col>
            <Col xs={4} className="text-end">
              <h5>
                <LoadingState
                  done={priceInfo}
                  then={(data) => `$${data.price}`}
                />
              </h5>
              <h5>
                <LoadingState
                  done={priceInfo}
                  then={(data) => `$${data.tax}`}
                />
              </h5>
              <h5>
                <LoadingState
                  done={priceInfo}
                  then={(data) => `$${data.total}`}
                />
              </h5>
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
