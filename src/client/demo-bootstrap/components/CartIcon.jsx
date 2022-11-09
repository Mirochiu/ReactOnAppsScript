import React from 'react';
import { BsCartFill } from 'react-icons/bs';
import Badge from 'react-bootstrap/Badge';

const CartIcon = ({ cartProducts }) => {
  return (
    <div className="border border-dark rounded p-2 d-inline-flex align-items-center">
      <BsCartFill className="me-1" />
      購物車
      {cartProducts ? (
        <Badge bg="dark" pill={true} className="ms-1 numb-in-cart">
          {cartProducts}
        </Badge>
      ) : null}
    </div>
  );
};

export default CartIcon;
