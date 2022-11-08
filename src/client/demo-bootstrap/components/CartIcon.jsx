import React from 'react';
import { BsCartFill } from 'react-icons/bs';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';

const CartIcon = ({ cartProducts }) => {
  return (
    <Button variant="outline-dark" className="text-white">
      <BsCartFill className="me-1" />
      購物車
      {cartProducts ? (
        <Badge bg="dark" pill={true} className="text-white ms-1 numb-in-cart">
          {cartProducts}
        </Badge>
      ) : null}
    </Button>
  );
};

export default CartIcon;
