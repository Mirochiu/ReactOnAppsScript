import React from 'react';
import { BsCartFill } from 'react-icons/bs';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import useCart from '../hooks/useCart';

const ItemBtn = ({ productId, amount = 1, onClickDone = () => {} }) => {
  const { add } = useCart();
  return (
    <div
      className="btn btn-outline-primary d-inline-flex justify-content-center align-items-center"
      onClick={() => {
        add(productId, amount);
        onClickDone();
      }}
    >
      <BsCartFill className="me-1" />
      <span className="d-none d-sm-block">加到購物車</span>
      <span className="d-sm-none">選購</span>
    </div>
  );
};

const MutipleOptionBtn = ({ priceList, productId, onClickDone = () => {} }) => {
  const { add } = useCart();
  return (
    <Dropdown as={ButtonGroup}>
      <Button variant="outline-primary">
        <span className="d-none d-sm-block">選擇價格</span>
        <span className="d-sm-none">選購</span>
      </Button>
      <Dropdown.Toggle split variant="outline-primary" />
      <Dropdown.Menu>
        {priceList.map((price, idx) => (
          <Dropdown.Item
            key={`price-list-${idx}`}
            onClick={() => {
              add(productId, 1, price);
              onClickDone();
            }}
          >
            $ {price}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

const AddCartBtn = ({ priceList, ...rest }) => {
  if (Array.isArray(priceList)) {
    return <MutipleOptionBtn priceList={priceList} {...rest} />;
  }
  return <ItemBtn {...rest} />;
};

export default AddCartBtn;
